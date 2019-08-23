import React, { Component } from 'react';
import './Smart.css';
import ModalDeposit from './ModalDeposit.js';
import ModalDepositSafely from './ModalDepositSafely.js';
import ModalCurrentNonce from './ModalCurrentNonce';
import ModalToken from './ModalToken';
import ModalGetSafetyAddress from './ModalGetSafetyAddress.js';
import ModalTransferSafetyKey from './ModalTransferSafetyKey.js';
import ModalTransferToken from './ModalTransferToken.js';

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
        <ModalGetSafetyAddress 
        	address={this.props.address} 
        	multisig={this.props.multisig} />
        <ModalDeposit 
        	web3={this.props.web3} 
        	address={this.props.address} 
        	multisig={this.props.multisig}
        	multisigAddress={this.props.multisigAddress}
        	updateBalances={this.props.updateBalances} />
        <ModalDepositSafely
        	web3={this.props.web3} 
        	address={this.props.address} 
        	multisig={this.props.multisig}
        	multisigAddress={this.props.multisigAddress}
        	updateBalances={this.props.updateBalances} />
        <ModalTransferSafetyKey 
        	web3={this.props.web3} 
        	address={this.props.address} 
        	multisig={this.props.multisig}
        	multisigAddress={this.props.multisigAddress}
        	updateBalances={this.props.updateBalances} />
        <ModalTransferToken 
            web3={this.props.web3} 
            address={this.props.address} 
            multisig={this.props.multisig}
            multisigAddress={this.props.multisigAddress}
            updateBalances={this.props.updateBalances} />       	
        <ModalCurrentNonce 
        	address={this.props.address}
        	multisig={this.props.multisig} />
       	<ModalToken 
            address={this.props.address}
            web3={this.props.web3} />
      </div>         
      );
  }
}

export default SmartContract;
