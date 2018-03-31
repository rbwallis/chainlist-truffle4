// Retrieving the account info can be done at the same time as initializing
// the contract
App = {
     web3Provider: null,
     contracts: {},
     account: 0x0,
     //address of the account by default

     init: function() {
          return App.initWeb3();
     },

     initWeb3: function() {
        // initialize web3: start it up
        if(typeof web3 !== 'undefined'){
        //a bang: exclamation point used for opposites, this case ==undefined
        //  means if it is defined,use network. Or...
        App.web3Provider = web3.currentProvider;
        //reuse the network provider of the web3 object injected by MetaMask
      } else {
      //create a new provider and plug it directly into our local node
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      // Naming it App.web3Provider and also stating the Ganache network provider
      }
     web3 = new Web3(App.web3Provider);
     // Connects to Ganache network provider

     App.displayAccountInfo();
     //Function call to display balance/acct in the front end

          return App.initContract();
          //calling a function to create an instance of the contract
     },

      displayAccountInfo: function(){
          // App.displayAccountInfo is calling this is a function

      //  console.log(web3.eth.accounts);
        // shows the account used in metamask w/ chrome's inspect

       web3.eth.getCoinbase(function(err, account){
            // these are call back function called error data function
          // aren't JavaScript promises. Web3 version upgrade will resolve this
         //retrieves the Coinbase acct. info to Ganache or MetaMask
         // an asynchronous function
        if(err === null) {
    //=== is a stricter comparison between data type and values
    //If error is equal to nothing(null), there is no error
          App.account = account;
          // assigns to App.account
          $('#account').text(account);
          // displays the address account number to the front end
          web3.eth.getBalance(account, function(err, balance){
            //Specify what account and to retrieve the balance
            if(err === null){
            $('#accountBalance').text(web3.fromWei(balance, "ether") + "ETH");
            //display the balance in ether to the front end
            }
          })
        }
     });
    },

       initContract: function() {
         // function to create an instance of the contract
         $.getJSON('Chainlist.json', function(chainListArtifact){
           // once artifact file chainlist.json is loaded, use it to create an instance
           // of the truffle contract abstraction
           // and deployment of address of the node(Ganache)
           App.contracts.ChainList = TruffleContract(chainListArtifact);
           //So this wraps up the Contract artifact into Truffle contract object
           App.contracts.ChainList.setProvider(App.web3Provider);
           //set the provider for our contracts
           // retrieve the article from the contracts
           return App.reloadArticles();

         });
     },
     reloadArticles: function(){
       //refreshes the homepage, ex: the account info because the balance might have changed
        App.displayAccountInfo();

        // retrieve the article (item) and clear it out,start w/ clean slate
       $('#articlesRow').empty();

        App.contracts.ChainList.deployed().then(function(instance){
          // Truffle abstractions function(instance) and getArticle are JavaScript promises
          // Web3 version upgrade will resolve this in future

          //deploying the contract and getting an instance of it
          return instance.getArticle();
        }).then(function(article){
          // can be asynchronous
          // the article exist or not with a if statement
          if(article[0] == 0x0){
            //no article with a acct, returns or leaves the function,
            return;
              // if yes, see below
          }
          //retrieve the article template and fill it w/data
          var articleTemplate = $('#articleTemplate');
          articleTemplate.find('.panel-title').text(article[1]);
          articleTemplate.find('.article-description').text(article[2]);
          articleTemplate.find('.article-price').text(web3.fromWei(article[3],"ether"));

          var seller = article[0];
          // the seller w/acct address hash
          if (seller == App.account){
            //in this practice, is our acct that's connected to
             seller = "You";
            //overriding the seller's account address with"you" in the frontend
          }
          articleTemplate.find('.article-seller').text(seller);
          //function to show 'You'

          //adding the article and putting in the front end
          $('#articlesRow').append(articleTemplate.html());
        }).catch(function(err) {
          console.error(err.message);
          // to catch any errors
        });
     },
     sellArticle: function(){
    // runs the sell article function in ChainList.sol
    //retrieve the detail of the article from the modal dialogue
    // where we enter the details

       //the info from modal is retrived
    var _article_name = $('#article_name').val();
    var _description = $('#article_description').val();
    var _price = web3.toWei(parseFloat($('#article_price').val() || 0), "ether");
    //parseFloat: converts a number in string format into a number
    // a || means or. a $  will retrieve what's in the bracket
    if ((_article_name.trim() == '') || (_price == 0)) {
      //remove blank spaces in the beginning/end and checks to see what's left
      // or a price hasn't been entered or 0 was entered, nothing to sell
      return false;
      // if there is a blank or price is 0, exits the function
    }
    // otherwise runs an instance of the deployed contract
    App.contracts.ChainList.deployed().then(function(instance){
      // with that instance, runs the sellArticle function(from above)
    return instance.sellArticle(_article_name, _description, _price, {
     //creates a trans, because it, cost gas: tell what acct# to get it and the maximum
      from: App.account,
      gas: 500000
    });

  }).then(function(result){
    //when the block containing the transaction corresponds to the sell articles
    // has been mined
    App.reloadArticles();
    // refreshes the page with current info article
  }).catch(function(err){
      //if there are any errors
      console.error(err);
      // catch block to log the error ,if any
     });
    },
  };

   $(function() {
     $(window).load(function() {
          App.init();
          //App.init is called when the page gets loaded

     });
});
