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
//state variables
//mapping will store a list of articles
//each article will be accessible through an unsigned(can't be negative number) integer key
mapping(uint => Article) public articles;
//public generates a getter to retrieve the above data, the arrow
//getter: get a value from a field
//uint arrow article generates a set of hidden code gets the article data

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
     address indexed _seller,
     address indexed _buyer,
     // indexed will show only seller and buyer
     string _name,
     uint256 _price
     );

   function sellArticle(string _name, string _description, uint256 _price) public {
     //increment an new article counter
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

     LogSellArticle(articleCounter, seller, name, price);
     }

  function getArticle() public view returns(
    address _seller,
    address _buyer,
    string _name,
    string _description,
    uint256 _price
    ) {
     return (seller, buyer, name, description, price);
  }

  // function to buy article
  function buyArticle() payable public {
    // we check whether there is an article for sale
    // payable: can receive value from its caller(buyer)
    require(seller != 0x0);
    //seller must have an article posted

    //we check that the article has not been sold yet
    // buyer haven't bought anything yet
    require(buyer == 0x0);

    // we check doesn't allow the seller to buy it's own article
    require(msg.sender != seller);
    // msg.sender is the buyer

    // we check that the right value sent corresponds to the price of the article
    require(msg.value == price);

    //keep track of the buyer's state ex: rentry errors
    buyer = msg.sender;

    // the buyer can pay the seller, must be payable(above) to make this work
    seller.transfer(msg.value);
    // forward the payment to seller

    //trigger the event to confirm the purchase and notify watchers of change
    LogBuyArticle(seller, buyer, name, price);
  }
 }
