import React from 'react';
import InitialTxHashComponent from '../../presentationalComponents/InitialTxHashComponent.js';
import ReceiptComponent from '../../presentationalComponents/ReceiptComponent.js';
import ModalContent from '../../presentationalComponents/ModalContent.js';
import RecoveryFormERC from '../../presentationalComponents/RecoveryFormERC.js';
import '../../css/Modal.css';
import {Transaction as Tx} from 'ethereumjs-tx';

class ModalRecoverERC extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            txHash: '',
            txReceipt: '',
            amountToTransfer: '',
            ownerPublic: '',
            recipientAddress: '',
            privateKey: '',
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
        case 'ownerPublic':
        case 'recipientAddress':
            if (event.target.validity.tooShort) {
                event.target.setCustomValidity('Public key has to be 42 characters');
            } else if (event.target.validity.patternMismatch) {
                event.target.setCustomValidity('Public key has to start with "0x"');
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
        default:
            break;
        }

        this.setState({ [name]: value });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.recoverFunds(this.state.ownerPublic, this.state.recipientAddress, this.state.amountToTransfer, this.state.privateKey);
        document.getElementById('RecoverERC').reset();
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

    recoverFunds = (ownerPublic, recipientAddress, amountToTransfer, privateKey) => {
        let web3 = this.props.web3;
        let multisigERC20Token = this.props.multisigERC20Token;
        let multisigERC20Address = this.props.multisigERC20Address;
        let modal = this;
        let updateERCBalances = this.props.updateERCBalances;
        let tokenSymbol = this.props.tokenSymbol;
        let addrFrom = this.props.address;
        const priv = Buffer.from(privateKey, 'hex');

        web3.eth.getTransactionCount(addrFrom, (err, txCount) => {
            // Build the transaction
            web3.eth.getGasPrice().then((gasPrice) => {

                multisigERC20Token.methods.recoverFunds(ownerPublic, recipientAddress, tokenSymbol, amountToTransfer).estimateGas({gas: gasPrice, from: addrFrom}, function(error, gasAmount) {
                    console.log('Current gas price: ', gasPrice);
                    console.log('Estimate of gas usage: ', gasAmount);
                    const txObject = {
                        nonce: web3.utils.toHex(txCount),
                        gasLimit: web3.utils.toHex(gasAmount*2), // Estimate is not always correct
                        gasPrice: web3.utils.toHex(gasPrice), // Pay Higher Price for testing purposes
                        to: multisigERC20Address,
                        data: multisigERC20Token.methods.recoverFunds(ownerPublic, recipientAddress, tokenSymbol, amountToTransfer).encodeABI()
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
                        updateERCBalances();
                        
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
    } 

    render() {

        return (
            <span>
                <RecoveryFormERC 
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

export default ModalRecoverERC;