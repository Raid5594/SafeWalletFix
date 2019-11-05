import React from 'react';
import InitialTxHashComponent from '../../presentationalComponents/InitialTxHashComponent.js';
import ReceiptComponent from '../../presentationalComponents/ReceiptComponent.js';
import ModalContent from '../../presentationalComponents/ModalContent.js';
import DepositFormERC from '../../presentationalComponents/DepositFormERC.js';
import '../../../css/Modal.css';
import { connect } from 'react-redux';
import { depositERC } from '../../../utils';

class ModalDepositERC extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            txHash: '',
            txReceipt: '',
            amountDeposit: '',
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
        case 'amountDeposit': 
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
        this.deposit(this.state.amountDeposit, this.state.privateKey);
        document.getElementById('DepositFormERC').reset();
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

    deposit = (amountDeposit, privateKey) => {
        const web3 = this.props.web3;
        const modal = this;
        const tokenImperial = this.props.tokenImperial;
        const tokenDemocratic = this.props.tokenDemocratic;
        const updateERCBalances = this.props.updateERCBalances;
        const multisigERC20Address = this.props.multisigERC20Address;
        const multisigERC20 = this.props.multisigERC20;
        const tokenSymbol = this.props.tokenSymbol;
        const address = this.props.address;
        depositERC(amountDeposit, privateKey, web3, modal, tokenImperial, tokenDemocratic, 
            updateERCBalances, multisigERC20Address, multisigERC20, tokenSymbol, address);
    }
        
    render() {

        return (
            <span>
                <DepositFormERC 
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

export default connect(mapStateToProps)(ModalDepositERC);