App = {
     web3Provider: null,
     contracts: {},

     init: function() {
        // Retrieving article(item) data into articlesRow
        var articlesRow = $('#articlesRow');
        //Inputting or loading the data
        var articleTemplate = $('#articleTemplate');

        articleTemplate.find('.panel-title').text('article 1');
        articleTemplate.find('.article-description').text('description for article 1');
        articleTemplate.find('.article-price').text("10.23");
        articleTemplate.find('.article-seller').text("0X1234567890123456890");
// the article(item)sample info from the templates above and insert into
// the below articlesRow.append code
        articlesRow.append(articleTemplate.html());

          return App.initWeb3();
     },

     initWeb3: function() {
          /*
           * Replace me...
           */

          return App.initContract();
     },

     initContract: function() {
          /*
           * Replace me...
           */
     },
};

$(function() {
     $(window).load(function() {
          App.init();
          //App.init is called when the page gets loaded
     });
});
