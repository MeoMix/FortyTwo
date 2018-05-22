const { moneyFormat, prefixPlus } = require('../common/utility.js');
const { isNaN, sortBy, reject, reduce, groupBy, keysIn, find, findLast } = require('lodash');

module.exports = class CoinDetailsView {

  constructor({ coins = [], isGdax = false, isLight = false, bitcoin = null, chartUrl = '' } = {}){
    if(!coins || !coins.length) throw new Error(`CoinDetailsView expects to be initialized with at least one coin`);
 
    this.coins = coins;
    this.isGdax = isGdax;
    this.isLight = isLight;
    this.bitcoin = bitcoin;
    this.chartUrl = chartUrl;
  }

  render(){
    if (this.isLight) {
      return this._getLightEmbed();
    }

    return this._getFullEmbed(this.coins[0]);
  }

  _getPercentLabel(percentChange){
    return isNaN(percentChange) ? `N/A` : `${prefixPlus(percentChange.toFixed(2))}%`;
  }

  _getPriceBtcMessage(coin){
    const priceBtc = coin.price_usd / this.bitcoin.price_usd;
    return coin.symbol === `BTC` ? `` : `${priceBtc.toFixed(8)}\u00A0BTC\u00A0\u00A0⇄\u00A0\u00A0`;
  }

  // TODO: Adjust this to rely on GdaxDao
  _getPriceUsdMessage(coin){
    return `$${(this.isGdax ? coin.gdaxPrice : coin.price_usd).toFixed(3)}${this.isGdax ? '\u00A0(GDAX)' : ''}`;
  }

  // TODO: Coin order doesn't seem to be respected when querying multiple coins.
  // TODO: It would be nice to have extra white-space between two inline light coin displays.
  _getLightEmbed(){
    return {
      embed: {
        color: 0x4CAF50,
        fields: this.coins.map(coin => {    
          const marketCap = moneyFormat(coin.market_cap_usd, 2);
          const volume = moneyFormat(coin.volume, 2);
          const priceBtcMessage = this._getPriceBtcMessage(coin);
          const priceUsdMessage = this._getPriceUsdMessage(coin);
          const oneHourChange = this._getPercentLabel(coin.percent_change_1h);
          const oneHourChangeIcon = this._getChangeIcon(coin.percent_change_1h);
          const oneDayChange = this._getPercentLabel(coin.percent_change_24h);
          const oneDayChangeIcon = this._getChangeIcon(coin.percent_change_24h);

          return {
            inline: true,
            // TODO: \u00a0 separator only desired for 2+ coins.
            name: `**[${coin.symbol}]** • ${priceBtcMessage}${priceUsdMessage}\u00a0`,
            value: `1H: **${oneHourChange}** ${oneHourChangeIcon} M.Cap: **${marketCap}**\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\n24H: **${oneDayChange}** ${oneDayChangeIcon} Volume: **${volume}**\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\n\u200b`
          };
        })
      }
    };
  }

  _getFullEmbed(coin){    
    const marketCap = moneyFormat(coin.market_cap_usd, 2);
    const volume = moneyFormat(coin.volume, 2);
    const rank = `${coin.rank}`;
    const priceBtcMessage = this._getPriceBtcMessage(coin);
    const priceUsdMessage = this._getPriceUsdMessage(coin);
    const oneHourChange = this._getPercentLabel(coin.percent_change_1h);
    const oneDayChange = this._getPercentLabel(coin.percent_change_24h);
    const oneWeekChange = this._getPercentLabel(coin.percent_change_7d);

    // Take all the markets and pull out the ones which have BTC pairs. Remove related, non-BTC pairs.
    // For all remaining markets (those which do not have BTC pairs), take the highest volume pair.
    const btcMarkets = coin.markets.filter(market => market.isBitcoin);
    const bestBtcMarkets = reduce(groupBy(btcMarkets, 'exchangeName'), (result, markets) => {
      result.push(sortBy(markets, 'rank')[0]);
      return result;
    }, []);
    const btcExchangeNames = bestBtcMarkets.map(({ exchangeName }) => exchangeName);
    const altMarkets = reject(coin.markets, ({ exchangeName }) => btcExchangeNames.includes(exchangeName)); 
    const bestAltMarkets = reduce(groupBy(altMarkets, 'exchangeName'), (result, markets) => {
      result.push(sortBy(markets, 'rank')[0]);
      return result;
    }, []);

    const displayedMarkets = sortBy([...bestBtcMarkets, ...bestAltMarkets], 'rank').slice(0, 4);
    const maxStatsLength = Math.max(...([rank, marketCap, volume].map(value => value.length)));
    const maxPriceLength = Math.max(...([oneHourChange, oneDayChange, oneWeekChange].map(value => value.length)));

    return {
      embed: {
        color: 0x4CAF50,
        author: {
          name: `[${coin.symbol}] • ${priceBtcMessage}${priceUsdMessage}`,
          url: `https://coinmarketcap.com/currencies/${coin.websiteSlug}/`,
          icon_url: `https://s2.coinmarketcap.com/static/img/coins/16x16/${coin.id}.png`
        },
        title: coin.name,
        description: `\`\`\`Hourly: ${oneHourChange.padStart(maxPriceLength)}\nDaily:  ${oneDayChange.padStart(maxPriceLength)}\nWeekly: ${oneWeekChange.padStart(maxPriceLength)}\`\`\`\`\`\`Rank:   ${rank.padStart(maxStatsLength)}\nM.Cap:  ${marketCap.padStart(maxStatsLength)}\nVolume: ${volume.padStart(maxStatsLength)}\`\`\``,
        fields: displayedMarkets.length ? [ 
          {
            name: `Exchanges`,
            value: displayedMarkets.map(({ isBitcoin, exchangeName, url }) => {
              const hyperlink = `[${exchangeName}](${url})`;
              return (isBitcoin ? hyperlink : `*${hyperlink}*`);
            }).join('     ')
          }
        ] : undefined,
        image: this.chartUrl ? {
          url: this.chartUrl
        } : undefined
      }
    };
  }

  _getChangeIcon(value) {
    const emojiis = {
      '100': `:100:`,
      '50': ':moneybag:',
      '25': ':full_moon_with_face:',
      '10': ':rocket:',
      '5': ':red_car:',
      '1': ':arrow_double_up:',
      '0': ':zzz:',
      '-1': ':arrow_double_down:',
      '-2.5': ':flag_white:',
      '-5': ':ambulance:',
      '-12.5': ':hospital:',
      '-25': ':skull_crossbones:',
      '-50': `:poop:`
    };

    // If value is positive then find the first emojii whose key is less than or equal to value
    // If value is negative then find the last emojii whose key is greater than or equal to value.
    const keys = keysIn(emojiis).sort((a, b) => b - a);
    const key = value >= 0 ? find(keys, key => value > key) : findLast(keys, key => key > value);

    // If the key isn't found then shown nothing
    return emojiis[key] || ``;
  }

};