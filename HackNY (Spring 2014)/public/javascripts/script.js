$(function() {
  $(document).on('click', 'button.contactBuyer', function() {
    var query = $(this).parent().parent().parent().find('strong.query').text();
    var sellingPrice = $(this).parent().parent().parent().find('strong.sellingPrice').text();
    var email = $(this).parent().parent().parent().find('input.buyingEmail').val();
    var result = {
      email: email,
      title: 'Buying ' + query,
      message: 'Hey! I\'d like to buy it for ' + sellingPrice + '. Looking forward to hear back from you!'};
    window.open('mailto:' + email + '?subject=' + result.title + '&body=' + result.message);
  });

  $(document).on('click', 'button.contactSeller', function() {
    var query = $(this).parent().parent().parent().find('strong.query').text();
    var buyingPrice = $(this).parent().parent().parent().find('strong.buyingPrice').text();
    var email = $(this).parent().parent().parent().find('input.buyingEmail').val();
    var result = {
      email: email,
      title: 'Selling ' + query,
      message: 'Hey! I\'d like to sell it for ' + buyingPrice + '. Looking forward to hear back from you!'};
    window.open('mailto:' + email + '?subject=' + result.title + '&body=' + result.message);
  });

  $('#search-button').on('click', function() {
    $('#totalProfit').html('0');
    $('#results').html('<img src="images/ajax-loader.gif">');
    var query = $('#search-input').val();
    var city = $('#city').val();
    var minPrice = $('#minPrice').val();
    var maxPrice = $('#maxPrice').val();

    $.get(
      'search?q=' + query + '&city=' + city + '&min=' + minPrice + '&max=' + maxPrice,
      function(data) {
        data.results.buying = _.sortBy(data.results.buying, function(buyingItem) {
          return parseInt(buyingItem.price, 10);
        });

        data.results.selling = _.sortBy(data.results.selling, function(sellingItem) {
          return parseInt(sellingItem.price, 10);
        });

        if(data.results.buying.length == 0) {
          $('#results').html('No results found.');
          return;
        }

        var matches = [];

        for(var i = 0; i < data.results.buying.length; i++) {
          var buyingItem = data.results.buying[i];
          var sellingItem = data.results.selling[i];
          matches.push({
            buying: buyingItem,
            selling: sellingItem,
            profit: buyingItem.price - sellingItem.price
          });
        }

        matches.forEach(function(match) {
          $('#totalProfit').html(parseInt($('#totalProfit').text()) + parseInt(match.profit));
          $.get('email?postID=' + match.buying.id + '&city=' + city, function(email) {
            match.buying.email = email;
          }).done(function() {
            $.get('email?postID=' + match.selling.id + '&city=' + city, function(email) {
              match.selling.email = email;
              $('#results').html('');
              matches.forEach(function(match) {
                $('#results').append(generateMatch(match, query));
              });
              $('#results').append('<br/><span style="color: rgb(104, 204, 67); font-size: 50px;">You can make $' +
                $('#totalProfit').text() + ' in profit!</span><br/><br/><br/><br/>');
            });
          });
        });
      }
    );
  });
});

function generateMatch(match, query) {
  var tableStart = '<table class="unstyled-table">'
  var message = '<tr><td colspan="3"><input type="hidden" class="buyingEmail" value="' + match.buying.email + '">' +
  '<input type="hidden" class="sellingEmail" value="' + match.selling.email + '">' +
  'Someone wants to buy <strong class="query">' + query + '</strong> for <strong class="buyingPrice">$' +
    match.buying.price + '</strong> and someone else wants to sell for <strong class="sellingPrice">$' + match.selling.price + '</strong></td></tr>';
  var contact = '<tr><td><button class="contactBuyer">Contact Seller</button></td>' + 
  '<td><button class="contactSeller">Contact Buyer</button></td><td class="profit">Profit: $' + match.profit + '</td></tr>'

  return tableStart + message + contact + '</table><br/>';
}
