import React, { Component } from 'react';
import './Smart.css';
import ModalDeposit from './ModalDeposit.js';

class SmartContract extends Component {
	constructor(props) {
	    super(props);
	    this.state = {
	    
	    }
  	};

  	render() {

    return (
      <div id="content" className ="smart">

        <p className="smartP"> Your address: {this.props.address}</p>
        <p className="smartP"> Ether balance (wei): {this.props.etherBalance}</p>
        <p className="smartP"> Contract balance (wei): {this.props.contractBalance}</p>
        <ModalDeposit 
        	web3={this.props.web3} 
        	address={this.props.address} 
        	multisig={this.props.multisig}
        	multisigAddress={this.props.multisigAddress}
        	updateBalances={this.props.updateBalances}/>

      </div>         
      );
  }
}

export default SmartContract;
