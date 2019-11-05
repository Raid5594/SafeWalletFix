import React from 'react';
import ModalContent from '../../presentationalComponents/ModalContent.js';
import GetTokenForm from '../../presentationalComponents/GetTokenForm.js';
import '../../../css/Modal.css';
import { connect } from 'react-redux';
import { generateSecret, verifyToken as verify } from '../../../utils';

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
        const web3 = this.props.web3;
        const privateKey = this.state.privateKey;
        const address = this.props.address;
        generateSecret(web3, address, privateKey, this.setSecret);
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

    setSecret = (secret) => {
        this.setState({ secret });
    }

    setData = (variable, data) => {
        this.setState({
            [variable]: data
        });
    }

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


    verifyToken = (e) => {
        e.preventDefault();
        verify(this.state.token, this.props.address, this.setData);
    }

    render() {

        const verifyTokenBtn = 
            <form onSubmit={this.verifyToken}>
                <hr/>
                <input type="text" name="token" onChange={this.tokenInputHandler} className="modalInput" placeholder="Token" required/>
                <button type="submit" className="modalButton">submit token</button>
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

function mapStateToProps(state) {
    return { 
        web3: state.data.web3,
        address: state.data.etherAddress
    };
}

export default connect(mapStateToProps)(ModalToken);