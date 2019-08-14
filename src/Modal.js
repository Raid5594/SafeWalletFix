import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './Modal.css';

const ModalTrigger = (props) => <button className="smartButtonLong" onClick={() => { props.toggle(); props.generateSecret(); }}>enable two-factor authentication</button>;
const ModalContent = ({toggle, modalRef, onKeyDown, onClickAway, children}) => {
	return ReactDOM.createPortal(
		<aside className="c-modal-cover" onKeyDown={onKeyDown} onClick={onClickAway} tabIndex="0">
		  <div className="c-modal" ref={modalRef}>
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

class Modal extends React.Component {

  constructor(props) {
  	super(props);
  	this.state = {
  		isOpen: false,
  		token: '',
      	secret: '',
      	notVerified: true,
      	goodToken: false
  	}
  }

  toggle = () => {
	this.setState({ 
		isOpen: !this.state.isOpen, 
	    notVerified: true
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

  generateSecret = () => {
  	var xhttp = new XMLHttpRequest();
    var data = { address: this.props.address };
    xhttp.onreadystatechange = () => {
            if (xhttp.readyState === 4) { // request is done
                if (xhttp.status === 200) { // successfully
                    var obj = JSON.parse(xhttp.responseText);
                    console.log(obj.secret);
                    this.setState({ secret: obj.secret });
                }
            }
        };
    xhttp.open("POST", "http://localhost:5597/totp-generate", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(data));
  }

  verifyToken = () => {
  	var xhttp = new XMLHttpRequest();
    var data = { 
    	token: this.state.token ,
    	address: this.props.address
    };
    xhttp.onreadystatechange = () => {
            if (xhttp.readyState === 4) { // request is done
                if (xhttp.status === 200) { // successfully
                    var obj = JSON.parse(xhttp.responseText);
                    console.log(obj.verified);
                    this.setState({ goodToken: obj.verified });
                }
            }
        };
    console.log(data);
    xhttp.open("POST", "http://localhost:5597/totp-verify", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(data));
    this.setState({ notVerified : false });
  }

  render() {

  	const verifyTokenBtn = 
  			<form>
       		  <hr/>
	          <input type="text" name="token" onChange={this.tokenInputHandler} className="modalInput" placeholder="Token" required/>
	          <button type="button" onClick={this.verifyToken} className="modalButton">submit token</button>
	        </form>;

    const correctToken = <p className="successToken">The token submitted is correct.</p>;
    const incorrectToken = <p className="failToken">The token submitted is incorrect.</p>;

  	return (
      <div>
       <ModalTrigger toggle={this.toggle} generateSecret={this.generateSecret}/>
       {
       	this.state.isOpen && 
       	<ModalContent 
       		toggle={this.toggle} 
       		onKeyDown={this.onKeyDown}
       		onClickAway={this.onClickAway}
       		modalRef={n => this.modalNode = n}> 
       		<p className="modalHeader">Two-factor authentication</p>
       		<hr/>
       		<img className="modalImg" src={this.state.secret} alt="Generic placeholder image" />
       		{ this.state.notVerified ? verifyTokenBtn : 
            	this.state.goodToken ? correctToken : incorrectToken }
       	</ModalContent>
       }
      </div>
    );
  }
}

export default Modal;