import { Router } from 'express';
import speakeasy from 'speakeasy';
import EthCrypto from 'eth-crypto';

const router = Router();

router.post('/', (request, response) => {
	console.log(request.body);  
	const addFrom = request.body.addressFrom
	const addrTo = request.body.addressTo;
	const value = request.body.amount;
	const nonce = request.body.nonce;
	const token = request.body.token;
	const symbol = request.body.symbol;

	const secret = request.context.get(addFrom);
	if (secret != undefined) {
		const verified = speakeasy.totp.verify({ 
			secret: secret.base32,
	        encoding: "base32",
	        token: request.body.token,
	        window: 0 
	    });
	    console.log({ "verified" : verified });
	    if (verified) {
			console.log({addrFrom: addFrom, addrTo: addrTo, value: value, nonce: nonce});
			const msg = [
			  { type: "address", value: addFrom},
			  { type: "address", value: addrTo},
			  { type: "uint256", value: value.toString()},
			  { type: "uint256", value: nonce.toString()},
			  { type: "bytes32", value: symbol}
			];
		 	console.log(msg);

			const _message = EthCrypto.hash.keccak256(msg); 
			const _signature = EthCrypto.sign(process.env.PRIVATE_KEY, _message);

			console.log(`message: ${_message}`);
			console.log(`signature: ${_signature}`);

			const data =
		              { message: _message,
		                signature: _signature,
		                verified: true
		              };
			response.send(JSON.stringify(data));
		} else {
			const data = { verified: false };
			response.send(JSON.stringify(data));
		}
	} else {
		const data = { verified: false };
		response.send(JSON.stringify(data));
	}
});

module.exports = router;
