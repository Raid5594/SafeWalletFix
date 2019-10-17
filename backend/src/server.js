const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const EthCrypto = require("eth-crypto");
const speakeasy = require("speakeasy");
const QRCode = require('qrcode');
const Web3 = require('web3');
const web3 = new Web3('https://ropsten.infura.io/v3/a33baa265ae340c29c82373e91533edf');


const priv = 'e6b8d253954deee60cbb2357f48aae9425015ca1b23912bc165927af94b5b0cc'

const app = express();
const port = 5597;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Mapping to store the secrets

let userSecrets = new Map();

// Get the data URL of the authenticator URL
/*QRCode.toDataURL(secret.otpauth_url, function(err, data_url) {
  console.log(data_url);

  // Display this data URL to the user in an <img> tag
  // Example:
  //write('<img src="' + data_url + '">');
});*/

app.post("/totp-generate", (request, response, next) => { 
	console.log(request.body.address)
	let secret = '';
	if (userSecrets.get(request.body.address) === undefined) {
		secret = speakeasy.generateSecret({ length: 20 });
		userSecrets.set(request.body.address, secret);
		console.log({ "New Secret: " : secret.base32});
		}
	else {
		secret = userSecrets.get(request.body.address);
	}

	web3.eth.getTransactionCount(request.body.address, (err, txCount) => {
    	if (err) {
	        console.log(err)
	        response.send({ secret : null});
	    } else {
	        let addressRecovered = web3.eth.accounts.recover(`Token ${txCount}`, request.body.signature);
	      	console.log('Address recovered: ', addressRecovered);

	      	if (addressRecovered == request.body.address) {
				QRCode.toDataURL(secret.otpauth_url, function(err, data_url) {
				  // Display this data URL to the user in an <img> tag
				  // Example:
				  response.send({ secret : data_url});
				});
			} else {
				response.send({ secret : null});
			}
	    }
    })

});


app.post("/totp-verify", (request, response, next) => { 
	var secret = userSecrets.get(request.body.address);
	var verified = speakeasy.totp.verify({ 
		secret: secret.base32,
        encoding: "base32",
        token: request.body.token,
        window: 0 
    });
    console.log({ "verified" : verified });
    response.send({ verified : verified});
});


app.post('/submit-transaction', (request, response) => {    
	console.log(request.body);  
	var addFrom = request.body.addressFrom
	var addrTo = request.body.addressTo;
	var value = request.body.amount;
	var nonce = request.body.nonce;
	var token = request.body.token;

	var secret = userSecrets.get(addFrom);
	if (secret != undefined) {
		var verified = speakeasy.totp.verify({ 
			secret: secret.base32,
	        encoding: "base32",
	        token: request.body.token,
	        window: 0 
	    });
	    console.log({ "verified" : verified });
	    if (verified) {
			console.log({addrFrom: addFrom, addrTo: addrTo, value: value, nonce: nonce});
			let msg = [
			  { type: "address", value: addFrom},
			  { type: "address", value: addrTo},
			  { type: "uint256", value: value.toString()},
			  { type: "uint256", value: nonce.toString()}
			];
		 	console.log(msg);
			const _message = EthCrypto.hash.keccak256(msg); 
			const _signature = EthCrypto.sign(priv, _message);

			console.log(`message: ${_message}`);
			console.log(`signature: ${_signature}`);

			var data =
		              { message: _message,
		                signature: _signature,
		                verified: true
		              };
			response.send(JSON.stringify(data));
		} else {
			var data = { verified: false };
			response.send(JSON.stringify(data));
		}
	} else {
		var data = { verified: false };
		response.send(JSON.stringify(data));
	}
});

app.post('/submit-transaction-erc', (request, response) => {    
	console.log(request.body);  
	var addFrom = request.body.addressFrom
	var addrTo = request.body.addressTo;
	var value = request.body.amount;
	var nonce = request.body.nonce;
	var token = request.body.token;
	var symbol = request.body.symbol;

	var secret = userSecrets.get(addFrom);
	if (secret != undefined) {
		var verified = speakeasy.totp.verify({ 
			secret: secret.base32,
	        encoding: "base32",
	        token: request.body.token,
	        window: 0 
	    });
	    console.log({ "verified" : verified });
	    if (verified) {
			console.log({addrFrom: addFrom, addrTo: addrTo, value: value, nonce: nonce});
			let msg = [
			  { type: "address", value: addFrom},
			  { type: "address", value: addrTo},
			  { type: "uint256", value: value.toString()},
			  { type: "uint256", value: nonce.toString()},
			  { type: "bytes32", value: symbol}
			];
		 	console.log(msg);
			const _message = EthCrypto.hash.keccak256(msg); 
			const _signature = EthCrypto.sign(priv, _message);

			console.log(`message: ${_message}`);
			console.log(`signature: ${_signature}`);

			var data =
		              { message: _message,
		                signature: _signature,
		                verified: true
		              };
			response.send(JSON.stringify(data));
		} else {
			var data = { verified: false };
			response.send(JSON.stringify(data));
		}
	} else {
		var data = { verified: false };
		response.send(JSON.stringify(data));
	}
});

var server=app.listen(port, () => {
	console.log('I am very alive on ' + port);
});



