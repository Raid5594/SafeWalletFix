import {Transaction as Tx} from 'ethereumjs-tx';

const deposit = (amountDeposit, privateKey, web3, modal, tokenImperial, 
    tokenDemocratic, updateERCBalances, multisigERC20Address, multisigERC20, tokenSymbol, address) => {
    
    const priv = Buffer.from(privateKey, 'hex');

    web3.eth.getTransactionCount(address, (err, txCount) => {
      // Build the transaction
        web3.eth.getGasPrice().then((gasPrice) => {
            multisigERC20.methods.depositFunds_xur(tokenSymbol, amountDeposit).estimateGas({gas: gasPrice, from: address}, function(error, gasAmount) {
                console.log('Current gas price: ', gasPrice);
                console.log('Estimate of gas usage: ', gasAmount);
                const txObject = {
                    nonce: web3.utils.toHex(txCount),
                    gasLimit: web3.utils.toHex(gasAmount),
                    gasPrice: web3.utils.toHex(gasPrice), 
                    to: multisigERC20Address,
                    data: multisigERC20.methods.depositFunds_xur(tokenSymbol, amountDeposit).encodeABI()
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

                    updateERCBalances(tokenImperial, tokenDemocratic, multisigERC20);

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

export default deposit;