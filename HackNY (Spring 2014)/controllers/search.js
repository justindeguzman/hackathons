/**
 * Module dependencies.
 */

var craigslist = require('node-craigslist');

/**
 * Module exports.
 */

module.exports = function(req, res) {
  // initialize the client and the city
  var client = craigslist({
    city : req.query.city
  });
  
  // set the minimum and maximum prices of the search query
  var options = {
    maxAsk : req.query.max,
    minAsk : req.query.min
  };

  // initialize the object that will hold the results
  var results = {
    selling: [],
    buying: []
  };

  // check if the listing is within the specified price range
  var withinPriceRange = function(price) {
    return price > options.minAsk && price < options.maxAsk;
  };

  // evaluate if the listing should be added to the results
  var evaluateListing = function(listing) {
    if(withinPriceRange(listing.price)) {
      // determine which category the listing is in
      var category =
        listing.category.indexOf('wanted') != -1 ? 'buying' : 'selling';

      // add the listing to the results
      addListingToResults(category, listing);
    }
  };

  // add the listing to the results
  var addListingToResults = function(category, listing) {
    results[category].push({
      id: listing.pid,
      price: listing.price,
      url: listing.url
    });
  };

  // search callback that handles the search results
  var searchCallback = function (err, listings) {
    listings.forEach(evaluateListing);
    res.send({results: results});
  };

  // initialize the search
  client.search(options, req.query.q, searchCallback);
};
