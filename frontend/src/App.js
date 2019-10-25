import React, { Component } from 'react';
import Login from './containerComponents/Login.js';
import BlockchainData from './containerComponents/BlockchainData.js';
import './css/App.css';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            etherAddress: '',
            login: false   
        };
    }

    setAddress = (address) => {
        this.setState({ 
            etherAddress: address,
            login: true
        });
    }

    render() {
        return (
            <div>
               { this.state.login ? <BlockchainData etherAddress={this.state.etherAddress} /> : <Login setAddress={this.setAddress}/>}
            </div>
        );
    }
}

export default App;
