import React from 'react';
import InitialTxHashComponent from '../../presentationalComponents/InitialTxHashComponent.js';
import ReceiptComponent from '../../presentationalComponents/ReceiptComponent.js';
import ModalContent from '../../presentationalComponents/ModalContent.js';
import DepositForm from '../../presentationalComponents/DepositForm.js';
import '../../../css/Modal.css';
import { connect } from 'react-redux';
import { depositEther } from '../../../utils';

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
        const address = this.props.address;

        depositEther(amountToDeposit, privateKey, web3, multisig, multisigAddress, modal, updateBalances, address);
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