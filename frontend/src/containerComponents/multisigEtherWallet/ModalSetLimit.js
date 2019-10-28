import React from 'react';
import InitialTxHashComponent from '../../presentationalComponents/InitialTxHashComponent.js';
import ReceiptComponent from '../../presentationalComponents/ReceiptComponent.js';
import ModalContent from '../../presentationalComponents/ModalContent.js';
import SetLimitForm from '../../presentationalComponents/SetLimitForm.js';
import '../../css/Modal.css';
import {Transaction as Tx} from 'ethereumjs-tx';
import EthCrypto from 'eth-crypto';
import BigNumber from 'bignumber.js';
import { connect } from 'react-redux';

class ModalSetLimit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            txHash: '',
            txReceipt: '',
            limit: '',
            safetyPrivateKey: '',
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
        case 'limit': 
            if (event.target.validity.patternMismatch) {
                event.target.setCustomValidity('Please input a number');
            } else {
                event.target.setCustomValidity('');
            }  
            break;
        case 'safetyPrivateKey':
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
        this.setDailyLimit(this.state.limit ,this.state.privateKey, this.state.safetyPrivateKey);
        document.getElementById('SetLimit').reset();    
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

    setDailyLimit = (limit, privateKey, safetyPrivateKey) => {
        const web3 = this.props.web3;
        const multisig = this.props.multisig;
        const multisigAddress = this.props.multisigAddress;
        const modal = this;
        const updateBalances = this.props.updateBalances;
        const addrFrom = this.props.address;
        const priv = Buffer.from(privateKey, 'hex');

        web3.eth.getTransactionCount(this.props.address, (err, txCount) => {
            multisig.methods.transactionNonces(addrFrom).call({from: addrFrom}, (error, nonce) => {
                if (error) {
                    console.log(error);
                } else {

                    web3.eth.getGasPrice().then((gasPrice) => {

                        // The next few lines go around issues with big numbers
                        let x = new BigNumber(limit);
                        let val = web3.utils.fromWei(x.toString(10), 'ether');
                        let value = web3.utils.toWei(val.toString(), 'ether');
                        
                        let msg = [
                          { type: "address", value: addrFrom},
                          { type: "uint256", value: value},
                          { type: "uint256", value: nonce.toString()}
                        ];

                        console.log(msg);
                        const _message = EthCrypto.hash.keccak256(msg); 
                        console.log(`message: ${_message}`);
                        
                        const _signature = EthCrypto.sign(safetyPrivateKey, _message);

                        console.log(`signature: ${_signature}`);
                        multisig.methods.setDailyLimit(limit, _signature).estimateGas({gas: gasPrice, from: addrFrom}, function(error, gasAmount) {
                            console.log('Current gas price: ', gasPrice);
                            console.log('Estimate of gas usage: ', gasAmount);
                            const txObject = {
                                nonce: web3.utils.toHex(txCount),
                                gasLimit: web3.utils.toHex(gasAmount), 
                                gasPrice: web3.utils.toHex(gasPrice), 
                                to: multisigAddress,
                                data: multisig.methods.setDailyLimit(limit, _signature).encodeABI()
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
    } 

    render() {

        return (
            <span>
                <SetLimitForm 
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

function mapStateToProps(state) {
    return { 
        web3: state.data.web3,
        address: state.data.etherAddress,
        multisig: state.data.multisig,
        multisigAddress: state.data.multisigAddress,
        updateBalances: state.data.updateBalancesEther
    };
}

export default connect(mapStateToProps)(ModalSetLimit);