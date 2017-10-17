const { toCodeBlock } = require('../common/utility.js');
const { map } = require('lodash');

module.exports = class Help {

  constructor({ id = '', command = '', description = '', examples = [], flags = [] } = {}) {
    this.id = id;
    this.command = command;
    this.description = description;
    this.examples = examples;
    this.flags = flags;
  }

  static getInstance(help) {
    return help instanceof Help ? help : new Help(help);
  }

  toString() {
    const examples = map(this.examples, example => `\n  • ${example}`).join('');
    const flags = this.flags ? map(this.flags, flag => `\n  • ${flag}`).join('') : 'None';

    return toCodeBlock(`
Command: ${this.command}
Description: ${this.description}
Examples: ${examples}
Flags: ${flags}`);
  }

};