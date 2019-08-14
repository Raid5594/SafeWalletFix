import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './Modal.css';

const ModalTrigger = ({toggle, getSafetyAddress, handleInputChange}) => 
        <form id="SafetyForm" onSubmit={getSafetyAddress}>
          <input type="text" name="addressToCheck" onChange={handleInputChange} className="smartInput" placeholder="Account address" required/>
          <button type="submit" className="smartButton" onClick={toggle}>safe address</button>
        </form>;
const ModalContent = ({toggle, modalRef, onKeyDown, onClickAway, children}) => {
	return ReactDOM.createPortal(
		<aside className="c-modal-cover" onKeyDown={onKeyDown} onClick={onClickAway} tabIndex="0">
		  <div className="c-modal-safety" ref={modalRef}>
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

class ModalSafetyAddr extends React.Component {

  constructor(props) {
  	super(props);
  	this.state = {
      addressToCheck: '',
      address: '',
  		isOpen: false
    }
  }

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    console.log(value);
    this.setState({
      [name]: value
    });
  }

  getSafetyAddress = (event) => {
    event.preventDefault();
    let my = this;
    this.props.getSafetyAddress(this.state.addressToCheck).then((result) => {
      my.setState({ address: result });
    })
    document.getElementById("SafetyForm").reset();
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
      <span>
       <ModalTrigger 
        toggle={this.toggle} 
        getSafetyAddress={this.getSafetyAddress}
        handleInputChange={this.handleInputChange}/>
       {
       	this.state.isOpen && 
       	<ModalContent 
       		toggle={this.toggle} 
       		onKeyDown={this.onKeyDown}
       		onClickAway={this.onClickAway}
       		modalRef={n => this.modalNode = n}> 
       		<p className="modalHeader">Your current safety address is: {this.state.address}</p> 
       	</ModalContent>
       }
      </span>
    );
  }
}

export default ModalSafetyAddr;