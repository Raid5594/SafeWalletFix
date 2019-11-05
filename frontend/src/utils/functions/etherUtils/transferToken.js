import {Transaction as Tx} from 'ethereumjs-tx';

const transfer = (amountToTransfer, recipientAddress, privateKey, tokenTFA,
    web3, multisig, multisigAddress, modal, updateBalances, address) => {

    const priv = Buffer.from(privateKey, 'hex');

    // Getting Ethereum transaction count
    web3.eth.getTransactionCount(address, (err, txCount) => {
      // Retrieving the current nonce inside the contract
        multisig.methods.transactionNonces(address).call({from: address}, (error, nonce) => {
            if (error) {
                console.log(error);
            } else {
                
                let xhttp = new XMLHttpRequest();
                const data =
                { addressFrom: address,
                  addressTo: recipientAddress, 
                  amount: amountToTransfer,
                  nonce: nonce,
                  token: tokenTFA
                };
                xhttp.onreadystatechange = () => {
                        if (xhttp.readyState === 4) { // request is done
                            if (xhttp.status === 200) { // successfully
                                let obj = JSON.parse(xhttp.responseText);
                                if (obj.verified) {
                                    console.log({ 
                                    addressFrom: address,
                                    addressTo: recipientAddress, 
                                    amount: amountToTransfer, 
                                    signature: obj.signature});
                                    // Build the transaction
                                    web3.eth.getGasPrice().then((gasPrice) => {
                                        console.log('Current gas price: ', gasPrice);    
                                        multisig.methods.verifyTransaction_26e(recipientAddress, amountToTransfer, obj.signature).estimateGas({gas: gasPrice, from: address}, function(error, gasAmount) {
                                            if (error) {
                                                console.log(error);
                                                
                                            } else {
                                            console.log('Estimate of gas usage: ', gasAmount);
                                            
                                            const txObject = {
                                                nonce: web3.utils.toHex(txCount),
                                                gasLimit: web3.utils.toHex(gasAmount), 
                                                gasPrice: web3.utils.toHex(gasPrice),
                                                to: multisigAddress,
                                                data: multisig.methods.verifyTransaction_26e(recipientAddress, amountToTransfer, obj.signature).encodeABI()
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

                                } else {
                                    alert('Wrong Token Submitted');
                                }   
                            }
                        }
                    };
                xhttp.open('POST', 'http://localhost:5597/submit-transaction', true);
                xhttp.setRequestHeader('Content-Type', 'application/json');
                xhttp.send(JSON.stringify(data));  
                }
            });
        }
    );
};

export default transfer;