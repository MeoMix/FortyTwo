
const { toCodeBlock } = require('./utility.js');
const AsciiTable = require('ascii-table');
const { times, constant, map, isString } = require('lodash');

module.exports = class Table {

  constructor(title){
    this.table = new AsciiTable(title);
  }

  setHeading(headings){
    this.headings = headings;
    this.table.setHeading(map(headings, heading => isString(heading) ? heading : heading.value));
  }

  getRows(){
    return this.table.getRows();
  }

  addRow(){
    this.table.addRow(...arguments);
  }

  toString(){
    // ascii-table displays improperly when no rows exist.
    // Make a clone of table to fix issue without mutating original.
    const table = new AsciiTable();
    table.fromJSON(this.table.toJSON());

    // Alignment is lost after cloning and only needed when outputting.
    for(let i = 0; i < this.headings.length; i++){
      if(this.headings[i].isNumber){
        table.setAlignRight(i);
      }
    }

    if (!table.getRows().length) {
      // TODO: Assumes row index is first column.
      table.addRow(0, ...times(this.headings.length - 2, constant('')));
    }

    return toCodeBlock(`${table.toString()}`);
  }

};