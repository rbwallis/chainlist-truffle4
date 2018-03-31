 pragma solidity ^0.4.18; // ChainList contract w/solidity compiler

 contract ChainList {
   // define the state variables that will be stored in contract state
   address seller; // of a wallet
   string name;
   string description;
   uint256 price; //256 since the large amounts in wei

    // this constructor will run once contract is deployed
    // Constructor was used to show the default data in the front end
  // function ChainList() public  {
  //   sellArticle("Default article", "This is an article set by default", 1000000000000000000);
     // 1 ether expressed in Wei
   //}

   // define a function to sell the article(item)
   function sellArticle(string _name, string _description, uint256 _price) public{
     seller = msg.sender;
     // seller is the sender, sender is the one running the contract
     // whoever is the sender is the seller
     // msg.sender retrives the address of the seller
     name = _name;
     description = _description;
     price = _price;
     // anytime you have an equal sign, assigns it to memory, it cost money
   }
  // get an article (item), a view function since you're just looking at the article(item)
  // Pure is a isolated function, Ex: currency converter wei to ether
  // no read or write to memory or cost, mark as pure
  function getArticle() public view returns(
    address _seller,
    string _name,
    string _description,
    uint256 _price
    ) {
  return (seller, name,description, price);
  }

 }
