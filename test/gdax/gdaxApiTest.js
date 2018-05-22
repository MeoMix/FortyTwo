const GdaxApi = require('../../src/gdax/gdaxApi.js');

xdescribe(`GdaxApi`, () => {
  
  describe(`constructor`, () => {
    it(`should instantiate without error and initialize default values`, () => {
      const gdaxApi = new GdaxApi();

      expect(gdaxApi).not.to.be.null;
    });
  });

  describe(`getProducts`, () => {
    it(`should return a list of products`, async () => {
      const gdaxApi = new GdaxApi();
      const products = await gdaxApi.getProducts();
      
      expect(products.length).to.be.greaterThan(0);
    });
  });

  describe(`getProductTicker`, () => {
    it(`should return undefined if no matching product ticker is found`, async () => {      
      const gdaxApi = new GdaxApi();
      const productTicker = await gdaxApi.getProductTicker(`123-USD`);
      
      expect(productTicker).not.to.exist;
    });

    it(`should return a product ticker if matching product id is found`, async () => {      
      const gdaxApi = new GdaxApi();
      const productTicker = await gdaxApi.getProductTicker(`BTC-USD`);
      
      expect(productTicker).to.exist;
    });
  });

});