import React, { Component } from 'react';
import '../../../css/Smart.css';
import ModalDeposit from './ModalDeposit.js';
import ModalDepositSafely from './ModalDepositSafely.js';
import ModalToken from './ModalToken';
import ModalGetSafetyAddress from './ModalGetSafetyAddress.js';
import ModalTransferSafetyKey from './ModalTransferSafetyKey.js';
import ModalTransferToken from './ModalTransferToken.js';
import ModalSetLimit from './ModalSetLimit.js';
import ModalWithdrawLimit from './ModalWithdrawLimit.js';
import ModalRecoverFundsSafely from './ModalRecoverFundsToSafeAddr.js';
import ModalRecoverFunds from './ModalRecoverFunds.js';
import ModalCheckDailyLimit from './ModalCheckDailyLimit.js';
import { connect } from 'react-redux';

class SmartContract extends Component {
    constructor(props) {
        super(props);
        this.state = {
            depositOptions: false,
            dailyLimitOptions: false,
            transactionOptions: false,
            recoveryOptions: false,
            safetyFeatures: false
        };
    }

    handleClick = (e) => {
        e.preventDefault();
        const name = e.target.name;
        this.setState({ [name]: !this.state[name] });
        let options = ['depositOptions', 'dailyLimitOptions', 'transactionOptions', 'recoveryOptions', 'safetyFeatures'];
        for (let i = 0; i < 5; i++) {
            if (options[i] !== name) {
                this.setState({ [options[i]]: false });
            }
        }
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
            <ModalDeposit />
            <ModalDepositSafely />
        </React.Fragment>
        : null
        }               
        <button className="smartButtonLong" name= "dailyLimitOptions" onClick={this.handleClick}>dailt limit management</button>
        {
        this.state.dailyLimitOptions ? 
        <React.Fragment>       
            <ModalSetLimit />
            <ModalWithdrawLimit />
            <ModalCheckDailyLimit />    
        </React.Fragment>
        : null
        }      
        <button className="smartButtonLong" name= "transactionOptions" onClick={this.handleClick}>transaction options</button>
        {
        this.state.transactionOptions ? 
        <React.Fragment>       
            <ModalTransferSafetyKey />
            <ModalTransferToken />
        </React.Fragment>
        : null
        }  
        <button className="smartButtonLong" name= "recoveryOptions" onClick={this.handleClick}>recovery options</button>
        {
        this.state.recoveryOptions ? 
        <React.Fragment>
            <ModalRecoverFundsSafely />
            <ModalRecoverFunds />              	
        </React.Fragment>
        : null
        }
        <button className="smartButtonLong" name= "safetyFeatures" onClick={this.handleClick}>safety features</button>
        {
        this.state.safetyFeatures ? 
        <React.Fragment>
            <ModalToken />
            <ModalGetSafetyAddress />               
        </React.Fragment>
        : null
        }
      </div>         
      );
  }
}

function mapStateToProps(state) {
    return { 
        address: state.data.etherAddress,
        etherBalance: state.data.etherBalance,
        contractBalance: state.data.contractBalance
    };
}

export default connect(mapStateToProps)(SmartContract);