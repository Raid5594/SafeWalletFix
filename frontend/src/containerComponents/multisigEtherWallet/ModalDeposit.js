import React from 'react';
import InitialTxHashComponent from '../../presentationalComponents/InitialTxHashComponent.js';
import ReceiptComponent from '../../presentationalComponents/ReceiptComponent.js';
import ModalContent from '../../presentationalComponents/ModalContent.js';
import DepositForm from '../../presentationalComponents/DepositForm.js';
import '../../css/Modal.css';
import {Transaction as Tx} from 'ethereumjs-tx';
import { connect } from 'react-redux';


class ModalDeposit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        txHash: '',
        txReceipt: '',
        amountToDeposit: '',
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
        case 'amountToDeposit': 
            if (event.target.validity.patternMismatch) {
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
        default:
            break;
        }
        this.setState({ [name]: value });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.deposit(this.state.amountToDeposit, this.state.privateKey);
        document.getElementById('DepositForm').reset();
    }
  
    openModal = () => {
        this.setState({ 
            isOpen: true, 
        });
    };

    closeModal = () => {
        this.setState({ 
            isOpen: false, 
        });
    };

    onKeyDown = (event) => {
        return event.keyCode === 27 && this.closeModal();
    }
  
    onClickAway = (event) => {
        if (this.modalNode && this.modalNode.contains(event.target)) return;
        this.closeModal();
    };

    deposit = (amountToDeposit, privateKey) => {
        const web3 = this.props.web3;
        const multisig = this.props.multisig;
        const multisigAddress = this.props.multisigAddress;
        const modal = this;
        const updateBalances = this.props.updateBalances;
        const priv = Buffer.from(privateKey, 'hex');

        web3.eth.getTransactionCount(this.props.address, (err, txCount) => {
          // Build the transaction
            web3.eth.getGasPrice().then((gasPrice) => {
                multisig.methods.deposit_CIx().estimateGas({gas: gasPrice, from: this.props.address, value: amountToDeposit}, function(error, gasAmount) {
                    console.log('Current gas price: ', gasPrice);
                    console.log('Estimate of gas usage: ', gasAmount);
                    const txObject = {
                        nonce: web3.utils.toHex(txCount),
                        gasLimit: web3.utils.toHex(gasAmount),
                        gasPrice: web3.utils.toHex(gasPrice), 
                        to: multisigAddress,
                        value: web3.utils.toHex(amountToDeposit),
                        data: multisig.methods.deposit_CIx().encodeABI()
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
    } 

    render() {

        return (
            <span>
                <DepositForm 
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
                        <InitialTxHashComponent transactionHash={this.state.txHash} /> : null} 
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

function mapStateToProps(state) {
    return { 
        web3: state.data.web3,
        address: state.data.etherAddress,
        multisig: state.data.multisig,
        multisigAddress: state.data.multisigAddress,
        updateBalances: state.data.updateBalancesEther
    };
}

export default connect(mapStateToProps)(ModalDeposit);