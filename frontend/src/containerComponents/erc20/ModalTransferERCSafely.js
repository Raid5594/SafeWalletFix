import React from 'react';
import InitialTxHashComponent from '../../presentationalComponents/InitialTxHashComponent.js';
import ReceiptComponent from '../../presentationalComponents/ReceiptComponent.js';
import ModalContent from '../../presentationalComponents/ModalContent.js';
import TransferWithKeyFormERC from '../../presentationalComponents/TransferWithKeyFormERC.js';
import '../../css/Modal.css';
import {Transaction as Tx} from 'ethereumjs-tx';
import EthCrypto from 'eth-crypto';
import BigNumber from 'bignumber.js';        

class ModalTransferERCSafely extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            txHash: '',
            txReceipt: '',
            amountToTransfer: '',
            recipientAddress: '',
            privateKey: '',
            safetyPrivateKey: '',
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
        this.transfer(this.state.amountToTransfer, this.state.recipientAddress, this.state.privateKey, this.state.safetyPrivateKey); 
        document.getElementById('TransferFormERC').reset();
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

    transfer = (amountToTransfer, recipientAddress, privateKey, safetyPrivateKey) => {
      
        let web3 = this.props.web3;
        let multisigERC20Token = this.props.multisigERC20Token;
        let multisigERC20Address = this.props.multisigERC20Address;
        let modal = this;
        let updateERCBalances = this.props.updateERCBalances;
        let tokenSymbol = this.props.tokenSymbol;
        let addrFrom = this.props.address;
        const priv = Buffer.from(privateKey, 'hex');
        BigNumber.set({ DECIMAL_PLACES: 18 }); // We need it to convert large wei inputs

        // Getting Ethereum transaction count
        web3.eth.getTransactionCount(addrFrom, (err, txCount) => {
            // Retrieving the current nonce inside the contract
            multisigERC20Token.methods.transactionNonces(addrFrom).call({from: addrFrom}, (error, nonce) => {
                if (error) {
                    console.log(error);
                } else {
                    
                    // The next few lines go around issues with big numbers
                    let x = new BigNumber(amountToTransfer);
                    let val = web3.utils.fromWei(x.toString(10), 'ether');
                    let value = web3.utils.toWei(val.toString(), 'ether');
                    
                    let msg = [
                      { type: "address", value: addrFrom},
                      { type: "address", value: recipientAddress},
                      { type: "uint256", value: value},
                      { type: "uint256", value: nonce.toString()},
                      { type: "bytes32", value: tokenSymbol}
                    ];

                    console.log(msg);
                    const _message = EthCrypto.hash.keccak256(msg); 
                    console.log(`message: ${_message}`);
                    
                    const _signature = EthCrypto.sign(safetyPrivateKey, _message);

                    console.log(`signature: ${_signature}`);
                    // Build the transaction
                    web3.eth.getGasPrice().then((gasPrice) => {
                        console.log('Current gas price: ', gasPrice);    
                        multisigERC20Token.methods.verifyTransaction__ef(recipientAddress, value, _signature, tokenSymbol).estimateGas({gas: gasPrice, from: addrFrom}, function(error, gasAmount) {
                            if (error) {
                                console.log(error);
                                
                            } else {
                                console.log('Estimate of gas usage: ', gasAmount);
                                
                                const txObject = {
                                    nonce: web3.utils.toHex(txCount),
                                    gasLimit: web3.utils.toHex(gasAmount), 
                                    gasPrice: web3.utils.toHex(gasPrice),
                                    to: multisigERC20Address,
                                    data: multisigERC20Token.methods.verifyTransaction__ef(recipientAddress, value, _signature, tokenSymbol).encodeABI()
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
                                    updateERCBalances();
                            
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
    } 

    render() {

        return (
            <span>
                <TransferWithKeyFormERC 
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

export default ModalTransferERCSafely;