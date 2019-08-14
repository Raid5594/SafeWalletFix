import React, { Component } from 'react';
import Web3 from 'web3';
import { MULTISIG_ABI, MULTISIG_ADDRESS } from './config';
import Login from './Login.js';
import BlockchainData from './FetchingBlockchainData.js';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      etherAddress: '',
      login: false
    }
  };

  setAddress = (address) => {
    this.setState({ 
      etherAddress: address,
      login: true
    });
  }

  render() {
    return (
      <div>
        { this.state.login ? <BlockchainData etherAddress={this.state.etherAddress}/> : <Login setAddress={this.setAddress} /> }
      </div>  
      );
  }
}

export default App;
