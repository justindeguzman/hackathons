var express = require('express');
var app = express();

// Parse application
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

var braintree = require('braintree');

var gateway = braintree.connect({
	environment: braintree.Environment.Sandbox,
	merchantId: "r44598y3bp9c9gxy",
	publicKey: "883n74q999ytt2s3",
	privateKey: "4de701d81a6c807fba184dee0d2e19f5"
});

app.get("/client_token", function (req, res) {
  gateway.clientToken.generate({
    //customerId: aCustomerId
  }, function (err, response) {
    res.send(response.clientToken);
  });
});

app.get('/', function(req, res) {
  res.send('whatup son hey dad');
});

app.get("/purchases", function(req,res) {
	gateway.transaction.sale({
	  amount: req.query.amount,
	  paymentMethodNonce: "nonce-from-the-client",
	}, function (err, result) {
		res.sendStatus(200);
	});
});
console.log("Starting server!");
app.listen(3000);
