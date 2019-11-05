import React from 'react';
import ModalContent from '../../presentationalComponents/ModalContent.js';
import SafeAddressFormERC from '../../presentationalComponents/SafeAddressFormERC.js';
import '../../../css/Modal.css';
import { connect } from 'react-redux';

class ModalERCSafetyAddress extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            addressToCheck: '',
            address: '',
            safetyAddress: '',
            isOpen: false
        };
    }

    static getDerivedStateFromProps(props) {
        return {address: props.address };
    }

    handleInputChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        if (name === 'addressToCheck') {
            if (event.target.validity.tooShort) {
                event.target.setCustomValidity('Public key has to be 42 characters');
            } else if (event.target.validity.patternMismatch) {
                event.target.setCustomValidity('Public key has to start with "0x"');
            } else {
                event.target.setCustomValidity('');
            }  
        }

        this.setState({
          [name]: value
        });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        
        this.props.multisigERC20.methods.safetyKeys(this.state.addressToCheck, this.props.tokenSymbol).call({ from: this.props.address }, (error, safetyAddress) => {
            if (error) {
                console.log(error);
            } else {
                console.log(safetyAddress);
                document.getElementById('SafetyFormERC').reset();
                this.setState({ safetyAddress: safetyAddress});
                this.toggle();
            }
        });
    }

    toggle = () => {
        this.setState({ 
            isOpen: !this.state.isOpen
        });
    };

    onKeyDown = (event) => {
        return event.keyCode === 27 && this.toggle();
    }
  
    onClickAway = (event) => {
        if (this.modalNode && this.modalNode.contains(event.target)) return;
        this.toggle();
    };

    render() {

        return (
            <span>
                <SafeAddressFormERC 
                handleSubmit={this.handleSubmit}
                handleInputChange={this.handleInputChange}/>
                {
                this.state.isOpen && 
                <ModalContent 
                toggle={this.toggle} 
                onKeyDown={this.onKeyDown}
                onClickAway={this.onClickAway}
                modalRef={n => this.modalNode = n}> 
                <p className="modalText">
                <span className="modalTextBlack">Your selected token safety address is:</span>
                <br/>
                {this.state.safetyAddress}
                </p> 
                </ModalContent>
                }
            </span>
        );
    }
}

function mapStateToProps(state) {
    return { 
        address: state.data.etherAddress,
        multisigERC20: state.data.multisigERC20,
        tokenSymbol: state.data.chosenTokenSymbol
    };
}

export default connect(mapStateToProps)(ModalERCSafetyAddress);