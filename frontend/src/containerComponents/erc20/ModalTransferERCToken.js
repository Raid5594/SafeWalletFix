import React from 'react';
import InitialTxHashComponent from '../../presentationalComponents/InitialTxHashComponent.js';
import ReceiptComponent from '../../presentationalComponents/ReceiptComponent.js';
import ModalContent from '../../presentationalComponents/ModalContent.js';
import TransferWithTokenFormERC from '../../presentationalComponents/TransferWithTokenFormERC.js';
import '../../css/Modal.css';
import {Transaction as Tx} from 'ethereumjs-tx';
import { connect } from 'react-redux';

class ModalTransferERCToken extends React.Component {

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
        document.getElementById('TransferFormTokenERC').reset();
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

        const web3 = this.props.web3;
        const tokenImperial = this.props.tokenImperial;
        const tokenDemocratic = this.props.tokenDemocratic;
        const multisigERC20 = this.props.multisigERC20;
        const multisigERC20Address = this.props.multisigERC20Address;
        const modal = this;
        const updateERCBalances = this.props.updateERCBalances;
        const tokenSymbol = this.props.tokenSymbol;
        const addrFrom = this.props.address;
        const priv = Buffer.from(privateKey, 'hex');

        // Getting Ethereum transaction count
        web3.eth.getTransactionCount(addrFrom, (err, txCount) => {
            // Retrieving the current nonce inside the contract
            multisigERC20.methods.transactionNonces(addrFrom).call({from: addrFrom}, (error, nonce) => {
                if (error) {
                    console.log(error);
                } else {
                    
                    var xhttp = new XMLHttpRequest();
                    var data =
                    { addressFrom: addrFrom,
                      addressTo: recipientAddress, 
                      amount: amountToTransfer,
                      nonce: nonce,
                      symbol: tokenSymbol,
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
                                    signature: obj.signature,
                                    symbol: tokenSymbol
                                    });
                                    // Build the transaction
                                    web3.eth.getGasPrice().then((gasPrice) => {
                                        console.log('Current gas price: ', gasPrice);    
                                        multisigERC20.methods.verifyTransaction__ef(recipientAddress, amountToTransfer, obj.signature, tokenSymbol).estimateGas({gas: gasPrice, from: addrFrom}, function(error, gasAmount) {
                                            if (error) {
                                                console.log(error);
                                                
                                            } else {
                                            console.log('Estimate of gas usage: ', gasAmount);
                                            
                                            const txObject = {
                                                nonce: web3.utils.toHex(txCount),
                                                gasLimit: web3.utils.toHex(gasAmount), 
                                                gasPrice: web3.utils.toHex(gasPrice),
                                                to: multisigERC20Address,
                                                data: multisigERC20.methods.verifyTransaction__ef(recipientAddress, amountToTransfer, obj.signature, tokenSymbol).encodeABI()
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
                                                
                                                updateERCBalances(tokenImperial, tokenDemocratic, multisigERC20);
                                        
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
                    xhttp.open('POST', 'http://localhost:5597/submit-transaction-erc', true);
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
                <TransferWithTokenFormERC 
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
        tokenImperial: state.data.tokenImperial,
        tokenDemocratic: state.data.tokenDemocratic,
        multisigERC20: state.data.multisigERC20,
        multisigERC20Address: state.data.multisigERC20Address,
        updateERCBalances: state.data.updateBalancesERC,
        tokenSymbol: state.data.chosenTokenSymbol
    };
}

export default connect(mapStateToProps)(ModalTransferERCToken);