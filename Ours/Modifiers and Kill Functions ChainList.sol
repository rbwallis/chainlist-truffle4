 pragma solidity ^0.4.18;

 contract ChainList {

struct Article{
  //struct: collection of related data
  //custom types: package the article's data
  uint id;
  // a id number for each article to be listed
  address seller;
  address buyer;
  string name;
  string description;
  uint256 price;
}
//self destruct the contract excerise
//state variables for saving owner's address: for self destructing by only the owner
address owner;

//mapping will store a list of articles
//each article will be accessible through an unsigned(can't be negative number) integer key
mapping(uint => Article) public articles;
//public generates a getter to retrieve the above data, the arrow
//getter: get a value from a field
//uint arrow article generates its own set of hidden code to get the article data

uint articleCounter;
//Counter: keeps track of the size of the mapping and
// which keys should have an associated value
// how many articles are posted, starts with one and go up

// Event: logging a new item for sale
event LogSellArticle(
  uint indexed _id,
  address indexed _seller,
  string _name,
  uint256 _price
  );
// Event: logging a new buyer
   event LogBuyArticle(
     uint indexed _id,
     address indexed _seller,
     address indexed _buyer,
     // indexed will show only seller and buyer
     string _name,
     uint256 _price
     );

     //function Modifers for only owner's use
     // You can use a modifers inside modifiers
     // Allows to use onlyOwner rather than using the require code,
     // Easily put onlyOwner in function lines
     modifier onlyOwner(){
       require(msg.sender == owner);
       _;
       //the under score is a placeholder the represents the code of the function
       //that the modifier applied to: Do everything in the Modifier first
     }

     // a self destruct constructor, whoever deployed the contract saved as msg.sender in VM
     //retrieve the address and store in the owner state variable
     //constructor is only called once when deployed
     function ChainList() public {
       owner = msg.sender;
     }

     // deactivate the contract
     function kill() public onlyOwner {
                  // only allow the contract owner(msg.sender) to use this function
                  //  require(msg.sender == owner);

      selfdestruct(owner);
      // owner is the argument. arg: what's in the parentheses
      // all remaining funds to be refunded back to the owner
     }

   function sellArticle(string _name, string _description, uint256 _price) public {
     //increment an new article counter
     //counter creates an id every time an item is posted
     articleCounter++;

     //storing this article
     articles[articleCounter] = Article(
       articleCounter,
       msg.sender,
       0x0,
       _name,
       _description,
       _price
       );

     LogSellArticle(articleCounter, msg.sender, _name, _price);
     }

   // Based on the counter, how many items are for sale
    function getNumberOfArticles() public view returns (uint){
      return articleCounter;
    }
   // fetch and return all article ids for articles still for sale and get a number
    function getArticlesForSale() public view returns (uint[]){
      //prepare output array (List), stops when it matches article counter
      uint[] memory articleIds = new uint[](articleCounter);
      uint numberOfArticlesForSale = 0;
      // running the same function but with a new number
      for(uint i = 1; i <= articleCounter; i++){
        // ++ means plus 1 for a loop
        // keep the id if the article is still for sale
        if(articles[i].buyer == 0x0){
          // see if there is a buyer
          articleIds[numberOfArticlesForSale] = articles[i].id;
          // if no buyer, add the article id to the list
          numberOfArticlesForSale++;
          //separate counter of what articles(items) is still for sale
        }
      }
      // copy the article ids array into a smaller for sale list array
      uint[] memory forSale = new uint[](numberOfArticlesForSale);
      for(uint j = 0; j < numberOfArticlesForSale; j++){
        // the array memory's length is not going to be bigger than the list
      forSale[j] = articleIds[j];
      // creates a new list of only articles for sale
      }
      return forSale;
      // returns a list down to size of what's for sale
    }

   // function to buy article
  function buyArticle(uint _id) payable public {
    // Buyer can choose what item to buy
    // payable: can receive value from its caller(buyer)
    require(articleCounter > 0);
    //check to see if an article is for sale
    //check to see at least one item for sale
    // Modified:Took out seller's code since, seller is in article id

    //check that article exists
    // id is equal or less than the counter
    require(_id > 0 && _id <= articleCounter);

    // retrieve the article from the mapping
    // This code is needed,needs to be told where to store the data
    // Storage is more permanent, memory is stored short-term
    Article storage article = articles[_id];

    //we check that the article has not been sold yet
    // buyer haven't bought anything yet and the right item id
    require(article.buyer == 0x0);

    // we check doesn't allow the seller to buy it's own article,id
    require(msg.sender != article.seller);
    // msg.sender is the buyer

    // we check that the right value sent corresponds to the price of the article,id
    require(msg.value == article.price);

    //keep track of the buyer's state ex: rentry errors
    article.buyer = msg.sender;

    // the buyer can pay the seller, must be payable(above) to make this work
    article.seller.transfer(msg.value);
    // forward the payment to seller

    //trigger the event to confirm the purchase and notify watchers of change
    LogBuyArticle(_id, article.seller, article.buyer, article.name, article.price);
  }
 }
