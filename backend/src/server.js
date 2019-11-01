import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';
import EthCrypto from 'eth-crypto';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import Web3 from 'web3';
import 'dotenv/config';
import userSecrets from './models';
import routes from './routes';

const app = express();
const port = process.env.PORT;
const priv = process.env.PRIVATE_KEY;
const web3 = new Web3(process.env.INFURA_API);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  	req.context = userSecrets;
  	next();
});

app.use('/totp-generate', routes.generateTotp);
app.use('/totp-verify', routes.verifyTotp);
app.use('/submit-transaction', routes.submitTransaction);
app.use('/submit-transaction-erc', routes.submitTransactionERC);

app.listen(port);



