const { toCodeBlock } = require('../common/utility.js');

module.exports = class Help {

  constructor({ id = '', command = '', description = '', examples = [], flags = [] } = {}) {
    this.id = id;
    this.command = command;
    this.description = description;
    this.examples = examples;
    this.flags = flags;
  }

  toString() {
    const examples = this.examples.map(example => `\n  • ${example}`).join('');
    const flags = this.flags ? this.flags.map(flag => `\n  • ${flag}`).join('') : 'None';

    return toCodeBlock(`
Command: ${this.command}
Description: ${this.description}
Examples: ${examples}
Flags: ${flags}`);
  }

};