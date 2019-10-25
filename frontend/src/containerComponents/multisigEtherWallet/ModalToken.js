import React from 'react';
import ModalContent from '../../presentationalComponents/ModalContent.js';
import GetTokenForm from '../../presentationalComponents/GetTokenForm.js';
import '../../css/Modal.css';

class ModalToken extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            token: '',
            secret: '',
            privateKey: '',
            notVerified: true,
            goodToken: false
        };
    }

    handleInputChange = (event) => {
        event.preventDefault();
        const { name, value } = event.target;

        if (name === 'privateKey') {
            if (event.target.validity.tooShort) {
                event.target.setCustomValidity('Private key has to be 64 characters');
            } else if (event.target.validity.patternMismatch) {
                event.target.setCustomValidity('Only alphanumeric characters are allowed');
            } else {
                event.target.setCustomValidity('');
            } 
        }
        this.setState({ [name]: value });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.generateSecret();
        this.toggle();
        document.getElementById('TokenForm').reset();
    }

    toggle = () => {
        if (this.state.isOpen) {
            this.setState({ secret: '' });
        }
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
        this.props.web3.eth.getTransactionCount(this.props.address, (err, txCount) => {
            if (err) {
                console.log(err);
            } else {
                let signatureObj = this.props.web3.eth.accounts.sign(`Token ${txCount}`, `0x${this.state.privateKey}`);
                let addrRecover = this.props.web3.eth.accounts.recover(`Token ${txCount}`, signatureObj.signature);
                var xhttp = new XMLHttpRequest();
                var data = { address: this.props.address , signature : signatureObj.signature};
                console.log(data);
                console.log(addrRecover);
                
                xhttp.onreadystatechange = () => {
                        if (xhttp.readyState === 4) { // request is done
                            if (xhttp.status === 200) { // successfully
                                var obj = JSON.parse(xhttp.responseText);
                                console.log(obj.secret);
                                if(obj.secret == null) {
                                  //this.setState({ secret: 'Wrong private key' });
                                } else {
                                  this.setState({ secret: obj.secret });
                                }
                            }
                        }
                    };
                xhttp.open('POST', 'http://localhost:5597/totp-generate', true);
                xhttp.setRequestHeader('Content-Type', 'application/json');
                xhttp.send(JSON.stringify(data));
            }
        });
    }

    verifyToken = () => {
        var xhttp = new XMLHttpRequest();
        var data = { 
            token: this.state.token, 
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
        xhttp.open('POST', 'http://localhost:5597/totp-verify', true);
        xhttp.setRequestHeader('Content-Type', 'application/json');
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
                <GetTokenForm 
                    handleSubmit={this.handleSubmit}
                    handleInputChange={this.handleInputChange}/>
                {
                this.state.isOpen && 
                <ModalContent 
                    toggle={this.toggle} 
                    onKeyDown={this.onKeyDown}
                    onClickAway={this.onClickAway}
                    modalRef={n => this.modalNode = n}> 
                    <p className="modalHeader">Two-factor authentication</p>
                    <hr/>
                    <img className="modalImg" src={this.state.secret} alt="" />
                    { this.state.notVerified ? verifyTokenBtn : 
                    this.state.goodToken ? correctToken : incorrectToken }
                </ModalContent>
                }
            </div>
        );
    }
}

export default ModalToken;