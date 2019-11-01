import { Router } from 'express';
import speakeasy from 'speakeasy';

const router = Router();

router.post('/', (request, response) => { 
	var secret = request.context.get(request.body.address);
	console.log(request.context);
	console.log(secret);
	var verified = speakeasy.totp.verify({ 
		secret: secret.base32,
        encoding: "base32",
        token: request.body.token,
        window: 0 
    });
    console.log({ "verified" : verified });
    response.send({ verified : verified});
});

module.exports = router;
