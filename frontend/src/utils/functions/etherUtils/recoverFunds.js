import {Transaction as Tx} from 'ethereumjs-tx';

const recoverFunds = (ownerPublic, recipientAddress, amountToTransfer, privateKey,
	web3, multisig, multisigAddress, modal, updateBalances, address)  => {
	  
    const priv = Buffer.from(privateKey, 'hex');

    web3.eth.getTransactionCount(address, (err, txCount) => {

        web3.eth.getGasPrice().then((gasPrice) => {

            multisig.methods.recoverFunds(ownerPublic, recipientAddress, amountToTransfer).estimateGas({gas: gasPrice, from: address}, function(error, gasAmount) {
                console.log('Current gas price: ', gasPrice);
                console.log('Estimate of gas usage: ', gasAmount);
                const txObject = {
                    nonce: web3.utils.toHex(txCount),
                    gasLimit: web3.utils.toHex(gasAmount), 
                    gasPrice: web3.utils.toHex(gasPrice), 
                    to: multisigAddress,
                    data: multisig.methods.recoverFunds(ownerPublic, recipientAddress, amountToTransfer).encodeABI()
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
    });
};

export default recoverFunds;