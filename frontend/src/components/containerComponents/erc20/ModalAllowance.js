import React from 'react';
import ModalContent from '../../presentationalComponents/ModalContent.js';
import AllowanceFormERC from '../../presentationalComponents/AllowanceFormERC.js';
import '../../../css/Modal.css';
import { connect } from 'react-redux';

class ModalAllowance extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            allowance: '',
            ownerPub: '',
            isOpen: false,
            allowanceReceipt: false,
        };
    }

    handleInputChange = (event) => {
        event.preventDefault();
        const { name, value } = event.target;

        switch (name) {
        case 'ownerPub':
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
        this.checkAllowance(this.state.ownerPub, this.props.multisigERC20Address);
        document.getElementById('AllowanceFormERC').reset();
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

    checkAllowance = (ownerPub, multisigERC20Address) => {
        const modal = this;
        const token = this.props.token;
        console.log(ownerPub);
        console.log(multisigERC20Address);
        console.log(token.address);
        console.log(token);
        token.methods.allowance(ownerPub, multisigERC20Address).call({ from: ownerPub }).then( allowance => {

            modal.setState({ 
                allowance: allowance,
                allowanceReceipt: true
            });
            modal.openModal();
            }
        );
    }

    render() {

        return (
            <span>
                <AllowanceFormERC 
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
                {this.state.allowanceReceipt ? 
                <p className="modalTextTx">Current contract allowance is: {this.state.allowance}</p> 
                : null} 
                </ModalContent>
                }
            </span>
        );
    }
}

function mapStateToProps(state) {
    return { 
        address: state.data.etherAddress,
        multisigERC20Address: state.data.multisigERC20Address,
        token: state.data.chosenToken
    };
}

export default connect(mapStateToProps)(ModalAllowance);