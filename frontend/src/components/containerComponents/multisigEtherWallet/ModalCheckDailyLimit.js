import React from 'react';
import ModalContent from '../../presentationalComponents/ModalContent.js';
import CheckDailyLimitForm from '../../presentationalComponents/CheckDailyLimitForm.js';
import '../../../css/Modal.css';
import { connect } from 'react-redux';
import { checkLimit } from '../../../utils';

class ModalCheckDailyLimit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            limit: '',
            ownerPub: '',
            isOpen: false,
            dailyLimitReceipt: false
        };
    }

    handleInputChange = (event) => {
        event.preventDefault();
        const { name, value } = event.target;

        if (name === 'ownerPub') {
            if (event.target.validity.tooShort) {
                event.target.setCustomValidity('Public key has to be 42 characters');
            } else if (event.target.validity.patternMismatch) {
                event.target.setCustomValidity('Public key has to start with "0x"');
            } else {
                event.target.setCustomValidity('');
            }  
        }

        this.setState({ [name]: value });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const ownerPub = this.state.ownerPub;
        const modal = this;
        const multisig = this.props.multisig;
        checkLimit(ownerPub, modal, multisig);
        document.getElementById('CheckDailyLimitERC').reset();
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

    render() {

      return (
          <span>
              <CheckDailyLimitForm 
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
                  {this.state.dailyLimitReceipt ? 
                  <p className="modalTextTx">Current Ether limit is: {this.state.limit}</p> 
                  : null} 
              </ModalContent>
              }
          </span>
      );
    }
}

function mapStateToProps(state) {
    return { 
        multisig: state.data.multisig
    };
}

export default connect(mapStateToProps)(ModalCheckDailyLimit);