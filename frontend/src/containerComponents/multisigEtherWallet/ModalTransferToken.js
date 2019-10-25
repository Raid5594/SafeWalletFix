import React from 'react';
import InitialTxHashComponent from '../../presentationalComponents/InitialTxHashComponent.js';
import ReceiptComponent from '../../presentationalComponents/ReceiptComponent.js';
import ModalContent from '../../presentationalComponents/ModalContent.js';
import TransferWithTokenForm from '../../presentationalComponents/TransferWithTokenForm.js';
import '../../css/Modal.css';
import {Transaction as Tx} from 'ethereumjs-tx';

class ModalTransferToken extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            txHash: '',
            txReceipt: '',
            amountToTransfer: '',
            recipientAddress: '',
            privateKey: '',
            tokenTFA: '',
            isOpen: false,
            hashReceipt: false,
            confirmationReceipt:false
        };
    }

    handleInputChange = (event) => {
        event.preventDefault();
        const { name, value } = event.target;

        switch (name) {
        case 'amountToTransfer': 
            if (event.target.validity.patternMismatch) {
              event.target.setCustomValidity('Please input a number');
            } else {
              event.target.setCustomValidity('');
            }
            break;
        case 'tokenTFA':
            if (event.target.validity.tooShort) {
                event.target.setCustomValidity('Token has to be 6 digits');
            } else if (event.target.validity.patternMismatch) {
              event.target.setCustomValidity('Please input a number');
            } else {
              event.target.setCustomValidity('');
            }
            break;
        case 'privateKey':
            if (event.target.validity.tooShort) {
              event.target.setCustomValidity('Private key has to be 64 characters');
            } else if (event.target.validity.patternMismatch) {
              event.target.setCustomValidity('Only alphanumeric characters are allowed');
            } else {
              event.target.setCustomValidity('');
            }
            break;
        case 'recipientAddress':
            if (event.target.validity.tooShort) {
              event.target.setCustomValidity('Public key has to be 42 characters');
            } else if (event.target.validity.patternMismatch) {
              event.target.setCustomValidity('Public key has to start with "0x"');
            } else {
              event.target.setCustomValidity('');
            }
            break;     
        default:
            break;
        }

        this.setState({ [name]: value });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.transfer(this.state.amountToTransfer, this.state.recipientAddress, this.state.privateKey, this.state.tokenTFA);
        document.getElementById('TransferFormToken').reset();        
    }
  
    openModal = () => {
        this.setState({ 
            isOpen: true
        });
    };

    closeModal = () => {
        this.setState({ 
            isOpen: false 
        });
    };

    onKeyDown = (event) => {
        return event.keyCode === 27 && this.closeModal();
    }
  
    onClickAway = (event) => {
        if (this.modalNode && this.modalNode.contains(event.target)) return;
        this.closeModal();
    };

    transfer = (amountToTransfer, recipientAddress, privateKey, tokenTFA) => {

        let web3 = this.props.web3;
        let multisig = this.props.multisig;
        let multisigAddress = this.props.multisigAddress;
        let modal = this;
        let updateBalances = this.props.updateBalances;
        let addrFrom = this.props.address;
        const priv = Buffer.from(privateKey, 'hex');

        // Getting Ethereum transaction count
        web3.eth.getTransactionCount(addrFrom, (err, txCount) => {
          // Retrieving the current nonce inside the contract
            multisig.methods.transactionNonces(addrFrom).call({from: addrFrom}, (error, nonce) => {
                if (error) {
                    console.log(error);
                } else {
                    
                    var xhttp = new XMLHttpRequest();
                    var data =
                    { addressFrom: addrFrom,
                      addressTo: recipientAddress, 
                      amount: amountToTransfer,
                      nonce: nonce,
                      token: tokenTFA
                    };
                    xhttp.onreadystatechange = () => {
                            if (xhttp.readyState === 4) { // request is done
                                if (xhttp.status === 200) { // successfully
                                    var obj = JSON.parse(xhttp.responseText);
                                    if (obj.verified) {
                                        console.log({ 
                                        addressFrom: addrFrom,
                                        addressTo: recipientAddress, 
                                        amount: amountToTransfer, 
                                        signature: obj.signature});
                                        // Build the transaction
                                        web3.eth.getGasPrice().then((gasPrice) => {
                                            console.log('Current gas price: ', gasPrice);    
                                            multisig.methods.verifyTransaction_26e(recipientAddress, amountToTransfer, obj.signature).estimateGas({gas: gasPrice, from: addrFrom}, function(error, gasAmount) {
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
                                                    updateBalances();
                                            
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
    }
  
    render() {

        return (
            <span>
            <TransferWithTokenForm 
            handleSubmit={this.handleSubmit} 
            handleInputChange={this.handleInputChange}
            errors={this.state.errors}/>
            {
            this.state.isOpen && 
            <ModalContent 
            closeModal={this.closeModal} 
            onKeyDown={this.onKeyDown}
            onClickAway={this.onClickAway}
            modalRef={n => this.modalNode = n}> 
            {this.state.hashReceipt ? 
            <InitialTxHashComponent transactionHash={this.state.txHash} />
            : null} 
            {this.state.confirmationReceipt ?
            <ReceiptComponent
            transactionHash={this.state.txReceipt.transactionHash}
            blockHash={this.state.txReceipt.blockHash}
            blockNumber={this.state.txReceipt.blockNumber}
            gasUsed={this.state.txReceipt.gasUsed}/>
            : null} 
            </ModalContent>
            }
            </span>
        );
    }
}

export default ModalTransferToken;