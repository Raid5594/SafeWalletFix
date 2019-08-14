import React, { Component } from 'react';
import Web3 from 'web3';
import Tx from 'ethereumjs-tx';
import EthCrypto from 'eth-crypto';
import { MULTISIG_ABI, MULTISIG_ADDRESS } from './config';
import SmartContract from './SmartContract'; 

class BlockchainData extends Component {

	constructor(props) {
		super(props);
		this.state = {
			web3: '',
			multisig: '',
			etherAddress: '',
			etherBalance: '',
			contractBalance: ''
		}
	}
	static getDerivedStateFromProps(props, state) {
    	return {etherAddress: props.etherAddress };
  	}

  	componentDidMount() {
  		const web3 = new Web3('https://ropsten.infura.io/v3/a33baa265ae340c29c82373e91533edf');
  		this.setState({ web3: web3 });
  		const multisig = new web3.eth.Contract(MULTISIG_ABI, MULTISIG_ADDRESS);
		this.setState({ multisig: multisig });
		web3.eth.getBalance(this.state.etherAddress, (error, balance) => {
			if (error) {
				console.log(error)
			} else {
		        this.setState({ etherBalance: balance });
	    		console.log('Account ether balance: ', this.state.etherBalance);
	    	}
			})
		multisig.methods.balances(this.state.etherAddress).call({from: this.state.etherAddress}, (error, balance) => {
		    if (error) {
		        console.log(error)
		    } else {
		        this.setState({ contractBalance: balance });
		       	console.log('The contract balance of account is: ', this.state.contractBalance);
		    }
		})
  	}

  	updateBalances = () => {
  		let etherBalance = null;
  		let contractBalance = null
	    this.state.multisig.methods.balances(this.state.etherAddress).call({ from: this.state.etherAddress }, (error, balance) => {
        	if (error) {
	    		console.log(error);
	    	} else {
	    		contractBalance = balance;
	    		this.state.web3.eth.getBalance(this.state.etherAddress, (error, balance) => {
		  			if (error) {
		  				console.log(error, 'Something went wrong');
		  			} else {
						etherBalance = balance;
						console.log(etherBalance);
						console.log('Ether',etherBalance);
			      		this.setState({ contractBalance : contractBalance, etherBalance : etherBalance});
			      		console.log('New etherBalance : ', this.state.etherBalance);
			      		console.log('New contractBalance : ', this.state.contractBalance);
			      	}
			      }
			    );
	      	}
      	});
  	}
  	
	render() {
  	  	return (
      		<div>
        		<SmartContract 
        			address={this.props.etherAddress} 
        			etherBalance={this.state.etherBalance}
        			contractBalance={this.state.contractBalance}
        			updateBalances={this.updateBalances}
        			web3={this.state.web3}
        			multisig={this.state.multisig} 
        			multisigAddress={MULTISIG_ADDRESS}/>
      		</div>  
      	);
  }
}

export default BlockchainData;
