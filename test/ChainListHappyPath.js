//Happy Path: Will be the test suite to run all test cases scenario
// Our first test case, Does it come back empty?
var ChainList =artifacts.require("./Chainlist.sol")
// artifacts: Tells Truffle what contract to interact(load)
//Wrapping the contract in a Truffle contract abstraction,
     // replacing ChainList.sol with ChainList

//Start test suite #1 with function call contract
//function accounts: inserts the list of available accts. on the node
contract('ChainList', function(accounts){
    //Testing two agruments: Chainlist and function called accounts

    //Start Test two
    var chainListInstance;
    var seller = accounts[1];
    var buyer = accounts[2];
    var articleName1 = "article 1";
    var articleDescription1 ="Description for article 1";
    var articlePrice1 = 10;
    var articleName2 = "article 2";
    var articleDescription2 = "Description for article 2";
    var articlePrice2 = 20;
    var sellerBalanceBeforeBuy, sellerBalanceAfterBuy;
    var buyerBalanceBeforeBuy, buyerBalanceAfterBuy;
    // assigning values to the variables that initially were empty

    // Start test case one seller and test case two buyer
  it("should be initialized with empty values", function(){
    // it command defines the condition at beginning of test

    //what will be tested: getarticlesforsale and getnumberofarticles
    return ChainList.deployed().then(function(instance){
        // Getting an instance(copy)of the contract
        //Promise: when contract is deployed, get the instance
        chainListInstance = instance;
      return chainListInstance.getNumberOfArticles();
      //Running the getArticle in the contract
      //getarticle function chains the promise to the instance
    }).then(function(data){
      // call another function that gets the data(info) of the chosen article
      // based on that, we can make some assertions w/ChainList
      //chai assert: verifies that something is correct, see data is equal to
      //console.log("data[3] should be ", data[3].toNumber());
          // helps with better understanding of error
      assert.equal(data.toNumber(), 0, "number of articles must be zero");
      //tonumber: a readable number that javascript can read
      return chainListInstance.getArticlesForSale();
    }).then(function(data){
      assert.equal(data.length, 0, "there shouldn't be any articles for sale");
    });
  });
  // continue of test getarticleforsale and number of articles
  // Testing the selling of first article, Does it retrieves/check values and LogSellArticle events
   it("should let us sell first article", function(){
    return ChainList.deployed().then(function(instance){
      chainListInstance = instance;
      return chainListInstance.sellArticle(
        articleName1,
        articleDescription1,
        web3.toWei(articlePrice1, "ether"),
        {from: seller}
      );
    }).then(function(receipt){
      // check the event LogSellArticle
      assert.equal(receipt.logs.length, 1, "one event should have been triggered");
      assert.equal(receipt.logs[0].event, "LogSellArticle", "event should be LogSellArticle");
      assert.equal(receipt.logs[0].args._id.toNumber(), 1, "id must be 1");
      assert.equal(receipt.logs[0].args._seller, seller, "event seller must be " + seller);
      assert.equal(receipt.logs[0].args._name, articleName1, "event article name must be " + articleName1);
      assert.equal(receipt.logs[0].args._price.toNumber(), web3.toWei(articlePrice1, "ether"), "event article price must be " + web3.toWei(articlePrice1, "ether"));

      return chainListInstance.getNumberOfArticles();
    }).then(function(data){
      assert.equal(data, 1, "number of articles must be one");

      return chainListInstance.getArticlesForSale();
    }).then(function(data) {
      assert.equal(data.length, 1, "there must be one article for sale");
      assert.equal(data[0].toNumber(), 1, "article id must be 1");

      return chainListInstance.articles(data[0]);
    }).then(function(data){
      assert.equal(data[0].toNumber(), 1, "article id must be 1");
      assert.equal(data[1], seller, "seller must be " + seller);
      assert.equal(data[2], 0x0, "buyer must be empty");
      assert.equal(data[3], articleName1, "article name must be " + articleName1);
      assert.equal(data[4], articleDescription1, "article description must be " + articleDescription1);
      assert.equal(data[5].toNumber(), web3.toWei(articlePrice1, "ether"), "article price must be " + web3.toWei(articlePrice1, "ether"));
    });
   });

   // Testing the selling of second article, Does it retrieves/check values and LogSellArticle events
    it("should let us sell second article", function(){
     return ChainList.deployed().then(function(instance){
       chainListInstance = instance;
       return chainListInstance.sellArticle(
         articleName2,
         articleDescription2,
         web3.toWei(articlePrice2, "ether"),
         {from: seller}
       );
     }).then(function(receipt){
       // check the event LogSellArticle
       assert.equal(receipt.logs.length, 1, "one event should have been triggered");
       assert.equal(receipt.logs[0].event, "LogSellArticle", "event should be LogSellArticle");
       assert.equal(receipt.logs[0].args._id.toNumber(), 2, "id must be 2");
       assert.equal(receipt.logs[0].args._seller, seller, "event seller must be " + seller);
       assert.equal(receipt.logs[0].args._name, articleName2, "event article name must be " + articleName2);
       assert.equal(receipt.logs[0].args._price.toNumber(), web3.toWei(articlePrice2, "ether"), "event article price must be " + web3.toWei(articlePrice2, "ether"));

       return chainListInstance.getNumberOfArticles();
     }).then(function(data){
       assert.equal(data, 2, "number of articles must be two");

       return chainListInstance.getArticlesForSale();
     }).then(function(data) {
       assert.equal(data.length, 2, "there must be two articles for sale");
       assert.equal(data[1].toNumber(), 2, "article id must be 2");

       return chainListInstance.articles(data[1]);
     }).then(function(data){
       assert.equal(data[0].toNumber(), 2, "article id must be 2");
       assert.equal(data[1], seller, "seller must be " + seller);
       assert.equal(data[2], 0x0, "buyer must be empty");
       assert.equal(data[3], articleName2, "article name must be " + articleName2);
       assert.equal(data[4], articleDescription2, "article description must be " + articleDescription2);
       assert.equal(data[5].toNumber(), web3.toWei(articlePrice2, "ether"), "article price must be " + web3.toWei(articlePrice2, "ether"));
     });
    });

    // test case: buy the first article
    it("should buy an article", function (){
    return ChainList.deployed().then(function(instance){
    chainListInstance = instance;
    // record balances of seller and buyer before the buy
    sellerBalanceBeforeBuy = web3.fromWei(web3.eth.getBalance(seller), "ether").toNumber();
    buyerBalanceBeforeBuy = web3.fromWei(web3.eth.getBalance(buyer), "ether").toNumber();
    return chainListInstance.buyArticle(1, {
      from: buyer,
      value: web3.toWei(articlePrice1, "ether")
        });
      }).then(function(receipt){
        assert.equal(receipt.logs.length, 1, "one event should have been triggered");
        assert.equal(receipt.logs[0].event, "LogBuyArticle", "event should be LogBuyArticle");
        assert.equal(receipt.logs[0].args._id.toNumber(), 1,"article id must be 1");
        assert.equal(receipt.logs[0].args._seller, seller, "event seller must be " + seller);
        assert.equal(receipt.logs[0].args._buyer, buyer, "event buyer must be " + buyer);
        assert.equal(receipt.logs[0].args._name, articleName1, "event article name must be " + articleName1);
        assert.equal(receipt.logs[0].args._price.toNumber(),web3.toWei(articlePrice1, "ether"), "event article price must be " + web3.toWei(articlePrice1, "ether"));

     //record balances of buyer and seller after the buy
     sellerBalanceAfterBuy = web3.fromWei(web3.eth.getBalance(seller), "ether").toNumber();
     buyerBalanceAfterBuy = web3.fromWei(web3.eth.getBalance(buyer), "ether").toNumber();

     // check the effect of buy on the balances of buyer and seller, accounting for gas
     assert(sellerBalanceAfterBuy == sellerBalanceBeforeBuy + articlePrice1, "seller should have earned " + articlePrice1 + " ETH");
     assert(buyerBalanceAfterBuy <= buyerBalanceBeforeBuy - articlePrice1, "buyer should have spent " + articlePrice1 + " ETH");

     return chainListInstance.getArticlesForSale();

   }).then(function(data){
     // check the state of the contract again make sure one article is left for sale
     assert.equal(data.length, 1, "there should now be only 1 article left for sale");
     assert.equal(data[0].toNumber(), 2, "article 2 should be the only article for sale");

     //list all articles sold or not
     return chainListInstance.getNumberOfArticles();
   }).then(function(data){
     assert.equal(data.toNumber(), 2, "there should still be 2 articles in total");

   });
    });
  });
