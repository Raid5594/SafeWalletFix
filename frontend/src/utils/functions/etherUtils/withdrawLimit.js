import {Transaction as Tx} from 'ethereumjs-tx';
import EthCrypto from 'eth-crypto';

const withdrawLimit = (privateKey, safetyPrivateKey, web3, multisig, multisigAddress, modal, updateBalances, address) => {
    const priv = Buffer.from(privateKey, 'hex');

    web3.eth.getTransactionCount(address, (err, txCount) => {
        multisig.methods.transactionNonces(address).call({from: address}, (error, nonce) => {
            if (error) {
                console.log(error);
            } else {
                // Build the transaction
                web3.eth.getGasPrice().then((gasPrice) => {
                
                    let msg = [
                      { type: 'address', value: address},
                      { type: 'uint256', value: nonce.toString()}
                    ];

                    console.log(msg);
                    const _message = EthCrypto.hash.keccak256(msg); 
                    console.log(`message: ${_message}`);
                    
                    const _signature = EthCrypto.sign(safetyPrivateKey, _message);

                    console.log(`signature: ${_signature}`);
                    multisig.methods.withdrawLimit(_signature).estimateGas({gas: gasPrice, from: address}, function(error, gasAmount) {
                        console.log('Current gas price: ', gasPrice);
                        console.log('Estimate of gas usage: ', gasAmount);
                        const txObject = {
                            nonce: web3.utils.toHex(txCount),
                            gasLimit: web3.utils.toHex(gasAmount), 
                            gasPrice: web3.utils.toHex(gasPrice), 
                            to: multisigAddress,
                            data: multisig.methods.withdrawLimit(_signature).encodeABI()
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
                            console.log('Transaction receipt: ', receipt);
                            updateBalances(multisig);
                            
                            modal.setState({ 
                                txReceipt: receipt,
                                confirmationReceipt: true, 
                                hashReceipt: false
                            });
                            modal.openModal(); 
                        })
                        .on('error', function(error){ console.log(error); });
                    });
                });
            }
        });
    });
};
export default withdrawLimit;