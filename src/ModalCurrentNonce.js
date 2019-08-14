import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './Modal.css';

const ModalTrigger = ({onHandleClick}) => <button className="smartButtonLong" onClick={onHandleClick}>check current nonce</button>;
const ModalContent = ({toggle, modalRef, onKeyDown, onClickAway, children}) => {
	return ReactDOM.createPortal(
		<aside className="c-modal-cover" onKeyDown={onKeyDown} onClick={onClickAway} tabIndex="0">
		  <div className="c-modal-nonce" ref={modalRef}>
		    <button className="c-modal__close" onClick={toggle}>
		      <svg className="c-modal__close-icon" viewBox="0 0 40 40"><path d="M 10,10 L 30,30 M 30,10 L 10,30"></path></svg>
		    </button>
		    <div className="c-modal__body">
		      {children}
		    </div>
		 </div>
		</aside>,
		document.body
	);
};

class ModalCurrentNonce extends React.Component {

  constructor(props) {
  	super(props);
  	this.state = {
  		isOpen: false,
      nonce: ''
    }
  }

  onHandleClick = (event) => {
    event.preventDefault();
    this.getNonce();
    this.toggle();  
  }

  getNonce = () => {
    this.props.multisig.methods.transactionNonces(this.props.address).call({ from: this.state.address }, (error, nonce) => {
        if (error) {
          console.log(error);
        } {
          console.log(nonce);
          this.setState({ nonce: nonce });
        }
      }
    );
  }
    
  toggle = () => {
	this.setState({ 
		isOpen: !this.state.isOpen, 
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
      <div>
       <ModalTrigger onHandleClick={this.onHandleClick}/>
       {
       	this.state.isOpen && 
       	<ModalContent 
       		toggle={this.toggle} 
       		onKeyDown={this.onKeyDown}
       		onClickAway={this.onClickAway}
       		modalRef={n => this.modalNode = n}> 
       		<p className="modalText">Your current nonce is: {this.state.nonce}</p> 
       	</ModalContent>
       }
      </div>
    );
  }
}

export default ModalCurrentNonce;