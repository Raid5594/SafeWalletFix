import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './Modal.css';

const ModalTrigger = ({toggle}) => <button className="smartButtonLong" onClick={toggle}>check current nonce</button>;
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

class ModalNonce extends React.Component {

  constructor(props) {
  	super(props);
  	this.state = {
  		isOpen: false,
      isUnmounted: false,
      nonce: ''
    }
  }

  componentDidMount() {
    // Now that this component has mounted,
    // Wait for earlier pre-fetch to complete and update its state.
    // (This assumes some kind of external cache to avoid duplicate requests.)
    this.props.getNonce().then(externalData => {
      if (!this._hasUnmounted) {
        console.log("Setting nonce to correct value");
        this.setState({ nonce: externalData });
      } else {
        console.log("Modal nonce unmounted");
      }
    });
  }

  componentWillUnmount() {
    console.log("About to unmount modalnonce");
    this._hasUnmounted = true;
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

  tokenInputHandler = (event) => {
  	this.setState({ token : event.target.value });
  }	

  render() {

  	return (
      <div>
       <ModalTrigger toggle={this.toggle}/>
       {
       	this.state.isOpen && 
       	<ModalContent 
       		toggle={this.toggle} 
       		onKeyDown={this.onKeyDown}
       		onClickAway={this.onClickAway}
       		modalRef={n => this.modalNode = n}> 
       		<p className="modalHeader">Your current nonce is: {this.state.nonce}</p> 
       	</ModalContent>
       }
      </div>
    );
  }
}

export default ModalNonce;