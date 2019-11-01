import { Router } from 'express';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import Web3 from 'web3';

const router = Router();
const web3 = new Web3(process.env.INFURA_API);

router.post('/', (request, response) => {
	console.log(request.context);
	let secret = '';
	if (request.context.get(request.body.address) === undefined) {
		secret = speakeasy.generateSecret({ length: 20 });
		request.context.set(request.body.address, secret);
		console.log({ "New Secret: " : secret.base32});
		}
	else {
		secret = request.context.get(request.body.address);
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

module.exports = router;

