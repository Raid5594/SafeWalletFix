import React, { Component } from 'react';
import './Smart.css';
import ModalDeposit from './ModalDeposit.js';
import ModalDepositSafely from './ModalDepositSafely.js';
import ModalCurrentNonce from './ModalCurrentNonce';
import ModalToken from './ModalToken';
import ModalGetSafetyAddress from './ModalGetSafetyAddress.js';
import ModalTransferSafetyKey from './ModalTransferSafetyKey.js';
import ModalTransferToken from './ModalTransferToken.js';
import ModalSetLimit from './multisigEtherWallet/ModalSetLimit.js';
import ModalWithdrawLimit from './multisigEtherWallet/ModalWithdrawLimit.js';
import ModalRecoverFundsSafely from './multisigEtherWallet/ModalRecoverFundsToSafeAddr.js';
import ModalRecoverFunds from './multisigEtherWallet/ModalRecoverFunds.js';

class SmartContract extends Component {
	constructor(props) {
	    super(props);
	    this.state = {
	       recoveryOptions: false,
           depositOptions: false,
           dailyLimitOptions: false,
           transactionOptions: false,
           safetyFeatures: false
	    }
  	};

    handleClick = (e) => {
        e.preventDefault();
        const name = e.target.name;
        this.setState({ [name]: !this.state[name] });
    }

  	render() {

    return (
      <div>
        <p className="smartP"> Your address: {this.props.address}</p>
        <p className="smartP"> Ether balance (wei): {this.props.etherBalance}</p>
        <p className="smartP"> Contract balance (wei): {this.props.contractBalance}</p>
        <button className="smartButtonLong" name= "depositOptions" onClick={this.handleClick}>deposit options</button>
        {
        this.state.depositOptions ? 
        <React.Fragment>       
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
        </React.Fragment>
        :
        null
        }               
        <button className="smartButtonLong" name= "dailyLimitOptions" onClick={this.handleClick}>dailt limit management</button>
        {
        this.state.dailyLimitOptions ? 
        <React.Fragment>       
        <ModalSetLimit
            web3={this.props.web3} 
            address={this.props.address} 
            multisig={this.props.multisig}
            multisigAddress={this.props.multisigAddress}
            updateBalances={this.props.updateBalances} />
        <ModalWithdrawLimit
            web3={this.props.web3} 
            address={this.props.address} 
            multisig={this.props.multisig}
            multisigAddress={this.props.multisigAddress}
            updateBalances={this.props.updateBalances} />
        </React.Fragment>
        :
        null
        }      
        <button className="smartButtonLong" name= "transactionOptions" onClick={this.handleClick}>transaction options</button>
        {
        this.state.transactionOptions ? 
        <React.Fragment>       
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
        </React.Fragment>
        :
        null
        }  
        <button className="smartButtonLong" name= "recoveryOptions" onClick={this.handleClick}>recovery options</button>
        {
        this.state.recoveryOptions ? 
        <React.Fragment>
        <ModalRecoverFundsSafely
            web3={this.props.web3} 
            address={this.props.address} 
            multisig={this.props.multisig}
            multisigAddress={this.props.multisigAddress}
            updateBalances={this.props.updateBalances}/>
        <ModalRecoverFunds
            web3={this.props.web3} 
            address={this.props.address} 
            multisig={this.props.multisig}
            multisigAddress={this.props.multisigAddress}
            updateBalances={this.props.updateBalances}/>              	
        </React.Fragment>
        :
        null
        }
        <button className="smartButtonLong" name= "safetyFeatures" onClick={this.handleClick}>safety features</button>
        {
        this.state.safetyFeatures ? 
        <React.Fragment>
        <ModalToken 
            address={this.props.address}
            web3={this.props.web3} />
        <ModalGetSafetyAddress 
            address={this.props.address} 
            multisig={this.props.multisig} />               
        </React.Fragment>
        :
        null
        }
      </div>         
      );
  }
}

export default SmartContract;
