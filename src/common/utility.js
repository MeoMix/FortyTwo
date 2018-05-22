const { isFinite, isArray } = require('lodash');

const utility = {
  
  prefixPlus(value){
    return (parseFloat(value) > 0) ? `+${value}` : `${value}`;
  },

  // Converts a string (which might have commas in it) to a float.
  // parseFloat will output the wrong value if given a number such as 1,000.
  toFloat(value){
    return parseFloat(value.replace(/,/g, ''));
  },

  // Shortens a number by dropping 0's and replacing with B/M/K
  // Example: 1,000,000 -> `1.000 B`
  moneyFormat(value, decimals = 3) {
    if(!isFinite(value)) return `N/A`;

    const absValue = Math.abs(value);

    if(absValue >= 1.0e+9){
      return `${(value / 1.0e+9).toFixed(decimals)}B`;
    }

    if(absValue >= 1.0e+6){
      return `${(value / 1.0e+6).toFixed(decimals)}M`;
    }

    if(absValue >= 1.0e+3){
      return `${(value / 1.0e+3).toFixed(decimals)}K`;
    }

    return value.toFixed(decimals);
  },

  getPercentChange(value1, value2){
    let change = 0;
    
    if(value1 > value2){
      change = ((value1 / value2) - 1) * 100;
    } else if(value1 < value2){
      change = (value2 - value1) / -value2 * 100;
    }

    return change;
  },

  getPercentChangeLabel(value1, value2){
    // NOTE: Can't use `this` and support destructuring.
    return `${utility.prefixPlus(utility.getPercentChange(value1, value2).toFixed(2))}%`;
  },

  toCodeBlock(value){
    return `\`\`\`${isArray(value) ? value.join('') : value}\`\`\``;
  },

  async sleep(msDelay){
    return await new Promise(resolve => setTimeout(resolve, msDelay));
  }

};

module.exports = utility;