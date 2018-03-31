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
    var articleName = "article 1";
    var articleDescription ="Description for article 1";
    var articlePrice = 10;
    var sellerBalanceBeforeBuy, sellerBalanceAfterBuy;
    var buyerBalanceBeforeBuy, buyerBalanceAfterBuy;
    // assigning values to the variables that initially were empty

    // Start test case one seller and test case two buyer
  it("should be initialized with empty values", function(){
    // it command defines the condition at beginning of test

    //what will be tested
    return ChainList.deployed().then(function(instance){
        // Getting an instance(copy)of the contract
        //Promise: when contract is deployed, get the instance
      return instance.getArticle();
      //Running the getArticle in the contract
      //getarticle function chains the promise to the instance
    }).then(function(data){
      // call another function that gets the data(info) of the chosen article
      // based on that, we can make some assertions w/ChainList
      //chai assert: verifies that something is correct, see data is equal to
      //console.log("data[3] should be ", data[3].toNumber());
          // helps with better understanding of error
      assert.equal(data[0], 0x0, "seller must be empty");
      assert.equal(data[1], 0x0, "buyer must be empty");
      assert.equal(data[2], "", "article name must be empty");
      assert.equal(data[3], "", "article decription must be empty");
      assert.equal(data[4].toNumber(), 0, "article price must be zero");
      //tonumber: a readable number that javascript can read
      // the 1 was inputed as error for testing, should be 0

    })
  });
  // continue of test two
  // Testing the selling of an article(item), Does it retrieves values and list them?
  it ("Should sell an article", function () {
  return ChainList.deployed().then(function(instance){
    chainListInstance =instance;
    return chainListInstance.sellArticle(articleName, articleDescription, web3.toWei(articlePrice, "ether"),{ from: seller});
    //  chainListInstance.sellArticle function will be mined first, then the return getArticle
    // list the item to sell
  }).then(function(){
    return chainListInstance.getArticle();
    // getArticle will retrieves the above values
  }).then(function(data){
    // from above, under Test two
    //then function will run the test
    assert.equal(data[0], seller, "seller must be " + seller);
    assert.equal(data[1], 0x0, "buyer must be empty");
    assert.equal(data[2], articleName, "article name must be " + articleName);
    assert.equal(data[3], articleDescription, "article decription must be " + articleDescription);
    assert.equal(data[4].toNumber(),web3.toWei(articlePrice, "ether"), "article price must be " + web3.toWei(articlePrice, "ether"));
  });
  });
    // Buyer test case
    it("should buy an article", function (){
    return ChainList.deployed().then(function(instance){
    chainListInstance = instance;
    // record balances of seller and buyer before the buy
    sellerBalanceBeforeBuy = web3.fromWei(web3.eth.getBalance(seller), "ether").toNumber();
    buyerBalanceBeforeBuy = web3.fromWei(web3.eth.getBalance(buyer), "ether").toNumber();
    return chainListInstance.buyArticle({
      from: buyer,
      value: web3.toWei(articlePrice, "ether")
        });
      }).then(function(receipt){
        assert.equal(receipt.logs.length, 1, "one event should have been triggered");
        assert.equal(receipt.logs[0].event, "LogBuyArticle", "event should be LogBuyArticle");
        assert.equal(receipt.logs[0].args._seller, seller, "event seller must be " + seller);
        assert.equal(receipt.logs[0].args._buyer, buyer, "event buyer must be " + buyer);
        assert.equal(receipt.logs[0].args._name, articleName, "event article name must be " + articleName);
        assert.equal(receipt.logs[0].args._price.toNumber(),web3.toWei(articlePrice, "ether"), "event article price must be " + web3.toWei(articlePrice, "ether"));

     //record balances of buyer and seller after the buy
     sellerBalanceAfterBuy = web3.fromWei(web3.eth.getBalance(seller), "ether").toNumber();
     buyerBalanceAfterBuy = web3.fromWei(web3.eth.getBalance(buyer), "ether").toNumber();

     // check the effect of buy on the balances of buyer and seller, accounting for gas
     assert(sellerBalanceAfterBuy == sellerBalanceBeforeBuy + articlePrice, "seller should have earned " + articlePrice + " ETH");
     assert(buyerBalanceAfterBuy <= buyerBalanceBeforeBuy - articlePrice, "buyer should have spent " + articlePrice + " ETH");

     return chainListInstance.getArticle();

   }).then(function(data){
     // check the state of the contract again make sure things haven't changed
     assert.equal(data[0], seller, "seller must be " + seller);
     assert.equal(data[1], buyer, "buyer must be " + buyer);
     assert.equal(data[2], articleName, "article name must be " + articleName);
     assert.equal(data[3], articleDescription, "article decription must be " + articleDescription);
     assert.equal(data[4].toNumber(),web3.toWei(articlePrice, "ether"), "article price must be " + web3.toWei(articlePrice, "ether"));

   });
    });


   it("should trigger an event when a new article is sold", function() {
    return ChainList.deployed().then(function(instance) {
    chainListInstance = instance;
    return chainListInstance.sellArticle(articleName, articleDescription, web3.toWei(articlePrice, "ether"), {from: seller});
  }).then(function(receipt) {
    assert.equal(receipt.logs.length, 1, "one event should have been triggered");
    assert.equal(receipt.logs[0].event, "LogSellArticle", "event should be LogSellArticle");
    assert.equal(receipt.logs[0].args._seller, seller, "event seller must be " + seller);
    assert.equal(receipt.logs[0].args._name, articleName, "event article name must be " + articleName);
    assert.equal(receipt.logs[0].args._price.toNumber(), web3.toWei(articlePrice, "ether"), "event article price must be " + web3.toWei(articlePrice, "ether"));

     });
   });
});