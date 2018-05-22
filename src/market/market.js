module.exports = class Market {

  constructor({ id, name, rank, exchangeName, url } = {}){
    this.id = id;
    this.name = name;
    this.rank = rank;
    this.exchangeName = exchangeName;
    this.url = url;
  }

};