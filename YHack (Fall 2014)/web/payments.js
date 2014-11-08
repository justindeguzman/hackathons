var braintree = require('braintree');

var gateway = braintree.connect({
	environment: braintree.Environment.Sandbox,
	merchantId: "r44598y3bp9c9gxy",
	publicKey: "883n74q999ytt2s3",
	privateKey: "4de701d81a6c807fba184dee0d2e19f5"
});