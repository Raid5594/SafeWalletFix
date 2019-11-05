import {Transaction as Tx} from 'ethereumjs-tx';
import EthCrypto from 'eth-crypto';
import BigNumber from 'bignumber.js';

const transfer = (amountToTransfer, recipientAddress, privateKey, safetyPrivateKey, 
    web3, multisig, multisigAddress, modal, updateBalances, address) => {

    const priv = Buffer.from(privateKey, 'hex');
    // We need it to convert large wei inputs
    BigNumber.set({ DECIMAL_PLACES: 18 }); 

    // Getting Ethereum transaction count
    web3.eth.getTransactionCount(address, (err, txCount) => {
        // Retrieving the current nonce inside the contract
        multisig.methods.transactionNonces(address).call({from: address}, (error, nonce) => {
            if (error) {
                console.log(error);
            } else {
                
                // The next few lines go around issues with big numbers
                const x = new BigNumber(amountToTransfer);
                const val = web3.utils.fromWei(x.toString(10), 'ether');
                const value = web3.utils.toWei(val.toString(), 'ether');
                
                const msg = [
                  { type: "address", value: address},
                  { type: "address", value: recipientAddress},
                  { type: "uint256", value: value},
                  { type: "uint256", value: nonce.toString()}
                ];

                console.log(msg);
                const _message = EthCrypto.hash.keccak256(msg); 
                console.log(`message: ${_message}`);
                
                const _signature = EthCrypto.sign(safetyPrivateKey, _message);

                console.log(`signature: ${_signature}`);
                // Build the transaction
                web3.eth.getGasPrice().then((gasPrice) => {
                    console.log('Current gas price: ', gasPrice);    
                    multisig.methods.verifyTransaction_26e(recipientAddress, value, _signature).estimateGas({gas: gasPrice, from: address}, function(error, gasAmount) {
                        if (error) {
                            console.log(error);
                            
                        } else {
                        console.log('Estimate of gas usage: ', gasAmount);
                        
                        const txObject = {
                            nonce: web3.utils.toHex(txCount),
                            gasLimit: web3.utils.toHex(gasAmount), // For testing, so transactions accepted faster
                            gasPrice: web3.utils.toHex(gasPrice),
                            to: multisigAddress,
                            data: multisig.methods.verifyTransaction_26e(recipientAddress, value, _signature).encodeABI()
                        };
                        console.log(txObject);

                        // Sign the transaction
                        const tx = new Tx(txObject, { chain: 'ropsten', hardfork: 'petersburg' });
                        tx.sign(priv);

                        const serializedTransaction = tx.serialize();
                        const rawTx = '0x' + serializedTransaction.toString('hex');
                        
                        console.log(rawTx);
                        
                        
                        // Broadcast the transaction
                        web3.eth.sendSignedTransaction(rawTx)
                        .once('transactionHash', function(hash){ 
                            console.log('Hash of transaction: ', hash);
                            modal.setState({ 
                                txHash: hash,
                                hashReceipt: true,
                                confirmationReceipt: false                       
                            });
                            modal.openModal();
                        })
                        .once('confirmation', function(confNumber, receipt){ 
                            console.log('Transaction confirmation number: ', confNumber);
                            console.log('Second receipt of transaction: ', receipt);
                            updateBalances(multisig);
                    
                            modal.setState({ 
                                txReceipt: receipt,
                                confirmationReceipt: true, 
                                hashReceipt: false
                            });
                            modal.openModal(); 
                        })
                        .on('error', function(error){ console.log(error); });
                        
                        }
                    });
                });
            }
        });
    });
};

export default transfer;