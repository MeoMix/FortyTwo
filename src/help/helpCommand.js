const Help = require('./help.js');
const { toCodeBlock } = require('../common/utility.js');

module.exports = class HelpCommand {

  constructor({ values = [] } = {}) {
    this.values = values;
    this.commandId = values.length ? values[0] : '';

    // TODO: When watch is better supported, add it to the docs.
    const helps = [this._getCalc(), this._getCall(), this._getCoin(), this._getTime(), this._getTipJar()];
    this.help = helps.find(help => help.id === this.commandId.toUpperCase());
  }

  async validate() {
    if (this.commandId && !this.help) {
      return `Unknown command: ${this.commandId}.`;
    }
  }

  async execute() {
    return this.help ? `${this.help}` : this._getHelpIntro();
  }

  _getHelpIntro() {
    return toCodeBlock(`Supported commands: coin, call, calc, time, tipjar. Say !help <command> for more information.`);
  }

  _getCoin() {
    return new Help({
      id: 'COIN',
      command: '!c, !coin',
      description: 'Get market information for a given coin, or for the overall market.',
      examples: ['!c', '!c -24h', '!c -7d', '!c wtc', '!c wtc -a'],
      flags: [
        '-l: Show just the highlights of a coin. Always enabled for multi-coin listings.',
        '-24h: Show best performing coins over last 24 hours. (Default: 1 hour)',
        '-7d: Show best performing coins over last 7 days. (Default: 1 hour)'],
    });
  }
  
  _getCall() {
    return new Help({
      id: 'CALL',
      command: '!call, !calls',
      description: 'Call a coin at a given price, or at current market price.',
      examples: ['!call wtc', '!call wtc .001', '!call -d -a'],
      flags: ['-d: Delete a call instead of creating.', '-a: Delete all calls. No effect without -d flag.', '-i: Show only your calls rather than all calls.']
    });
  }

  _getCalc() {
    return new Help({
      id: 'CALC',
      command: '!calc',
      description: 'Calculate the answer to a given equation.',
      examples: ['!calc 1 + 2']
    });
  }

  _getTime() {
    return new Help({
      id: 'TIME',
      command: '!time',
      description: 'Display the current time around the world.',
      examples: ['!time']
    });
  }

  _getTipJar(){
    return new Help({
      id: 'TIPJAR',
      command: '!tipjar',
      description: 'Display tipjar donation information.',
      examples: ['!tipjar']
    });
  }

};