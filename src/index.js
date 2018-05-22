require('dotenv').config();

const Database = require('./common/database.js');
const Bot = require('./discord/bot.js');
const ExchangeUpdateMessenger = require('./exchange/exchangeUpdateMessenger.js');
const ExchangeFactory = require('./exchange/exchangeFactory.js');
const ChatCommandResponder = require('./chat/chatCommandResponder.js');
const ChatCommandFactory = require('./chat/chatCommandFactory.js');
const ChannelDao = require('./channel/channelDao.js');
const CoinDao = require('./coin/coinDao.js');
const Discord = require('discord.js');
const express = require('express');
const axios = require('axios');
const puppeteer = require('puppeteer');

(async () => {

  try {
    console.log(`Initializing cron job routes`);
    const app = express();
    const baseUrl = `https://us-central1-fortytwo-183202.cloudfunctions.net`;
    app.get('/updateCoins', (req, res) => axios.post(`${baseUrl}/updateCoins`).then(res.sendStatus(200)).catch((error) => console.error(`Failed to post to /updateCoins. Reason:`, error.message)));
    //app.get('/updateMarkets', (req, res) => axios.post(`${baseUrl}/updateMarkets`).then(res.sendStatus(200)).catch((error) => console.error(`Failed to post to /updateMarkets. Reason:`, error.message)));
    //app.get('/updateGdax', (req, res) => axios.post(`${baseUrl}/updateGdax`).then(res.sendStatus(200)).catch((error) => console.error(`Failed to post to /updateGdax. Reason:`, error.message)));
    app.listen(8080);
    
    console.log(`Establishing database connection`);
    const database = new Database(process.env.DB_DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, process.env.DB_SOCKET_PATH);
    await database.connect();

    console.log('Loading coin state');
    const coinDao = new CoinDao(database);
    
    console.log('Initializing bot');
    const bot = new Bot(coinDao, new Discord.Client(), process.env.DISCORD_TOKEN);

    // Launch puppeteer earlier than necessary to reduce latency in responding to user requests.
    console.log('Launching puppeteer');
    const browser = await puppeteer.launch({ 
      args: ['--no-sandbox']
    });

    const chatCommandFactory = new ChatCommandFactory(database, bot, browser);
    const chatCommandResponder = new ChatCommandResponder(chatCommandFactory, coinDao);
    chatCommandResponder.startResponding(bot);

    console.log(`Initializing monitoring`);
    // const exchangeUpdateMessenger = new ExchangeUpdateMessenger(bot, new ChannelDao(database), coinDao);
    // const exchangeFactory = new ExchangeFactory();
    // exchangeUpdateMessenger.startMonitoring(await exchangeFactory.getExchanges());

    console.log('Logging in');
    await bot.login();

    console.log('Waiting for messages');
  } catch(error){
    console.error(`Server encountered an error. Reason:`, error.message);
  }

})();