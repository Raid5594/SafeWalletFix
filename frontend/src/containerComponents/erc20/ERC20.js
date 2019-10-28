import React, { Component } from 'react';
import '../../css/Smart.css';
import ModalTokenAllowance from './ModalTokenAllowance.js'; 
import ModalAllowance from './ModalAllowance.js';
import ModalDepositERC from './ModalDepositERC.js';
import ModalTransferERCToken from './ModalTransferERCToken.js';
import ModalTransferERCSafely from './ModalTransferERCSafely.js';
import ModalDepositERCSafely from './ModalDepositERCSafely.js';
import ModalToken from '../multisigEtherWallet/ModalToken.js'; 
import ModalERCSafetyAddress from './ModalERCSafetyAddress.js';
import ModalERCSetLimit from './ModalERCSetLimit.js';
import ModalERCWithdrawLimit from './ModalERCWithdrawLimit.js';
import ModalRecoverERCSafely from './ModalRecoverERCSafely.js';
import ModalRecoverERC from './ModalRecoverERC.js';
import ModalCheckDailyLimitERC from './ModalCheckDailyLimitERC.js';
import { connect } from 'react-redux';
import { setChosenToken, setChosenTokenSymbol } from '../../redux/actions';

class ERC20 extends Component {
	constructor(props) {
        super(props);
        this.state = {
            chosenTokenBalance: 'tokenImperialBalance',
            chosenTokenContractBalance: 'tokenImperialContractBalance',
            depositOptions: false,
            dailyLimitOptions: false,
            transactionOptions: false,
            recoveryOptions: false,
            safetyFeatures: false
        };
        this.props.setChosenToken(this.props.tokenImperial);
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

    handleChange = (event) => {

        console.log(event.target.value);
        let tokenName = event.target.value;
        this.setState({
            chosenTokenBalance: event.target.value,
        });
        switch(tokenName) {
            case 'tokenImperialBalance':
                this.props.setChosenToken(this.props.tokenImperial);
                this.props.setChosenTokenSymbol('0x746f6b656e496d70657269616c00000000000000000000000000000000000000');
                this.setState({
                    chosenTokenContractBalance: 'tokenImperialContractBalance'
                });
                break;
            case 'tokenDemocraticBalance':
                this.props.setChosenToken(this.props.tokenDemocratic);
                this.props.setChosenTokenSymbol('0x746f6b656e44656d6f6372617469630000000000000000000000000000000000');
                this.setState({
                    chosenTokenContractBalance: 'tokenDemocraticContractBalance'
                });
                break;
            default:
                break;
        }

    }

    render() {

        return (
            <div>
                <p className="smartP"> Your address: {this.props.address}</p>
                <div className="smartDiv">
                    <select name="tokens" className="smartSelect" onChange={this.handleChange}>
                        <option value="tokenImperialBalance">Token Imperial</option>
                        <option value="tokenDemocraticBalance">Token Democratic</option>
                    </select>
                </div>
                <p className="smartP"> Your token balance on Ethereum: {this.props[this.state.chosenTokenBalance]}</p>
                <p className="smartP"> Your token contract balance: {this.props[this.state.chosenTokenContractBalance]}</p>
                <button className="smartButtonLong" name= "depositOptions" onClick={this.handleClick}>deposit options</button>
                {
                this.state.depositOptions ? 
                <React.Fragment>  
                    <ModalTokenAllowance />
                    <ModalAllowance />
                    <ModalDepositERC />
                    <ModalDepositERCSafely />
                </React.Fragment>
                : null
                }
                <button className="smartButtonLong" name= "dailyLimitOptions" onClick={this.handleClick}>dailt limit management</button>
                {
                this.state.dailyLimitOptions ? 
                <React.Fragment>       
                    <ModalERCSetLimit />
                    <ModalERCWithdrawLimit />
                    <ModalCheckDailyLimitERC />
                </React.Fragment>
                : null
                }   
                <button className="smartButtonLong" name= "transactionOptions" onClick={this.handleClick}>transaction options</button>
                {
                this.state.transactionOptions ? 
                <React.Fragment>       
                    <ModalTransferERCSafely />
                    <ModalTransferERCToken />
                </React.Fragment>
                : null
                }    
                <button className="smartButtonLong" name= "recoveryOptions" onClick={this.handleClick}>recovery options</button>    
                {
                this.state.recoveryOptions ? 
                <React.Fragment>
                    <ModalRecoverERCSafely />  
                    <ModalRecoverERC />          
                </React.Fragment>
                : null
                }
                <button className="smartButtonLong" name= "safetyFeatures" onClick={this.handleClick}>safety features</button>
                {
                this.state.safetyFeatures ? 
                <React.Fragment>
                    <ModalToken  />
                    <ModalERCSafetyAddress />              
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
        tokenImperial: state.data.tokenImperial,
        tokenDemocratic: state.data.tokenDemocratic,
        tokenImperialBalance: state.data.tokenImperialBalance,
        tokenDemocracticBalance: state.data.tokenDemocracticBalance,
        tokenImperialContractBalance: state.data.tokenImperialContractBalance,
        tokenDemocraticContractBalance: state.data.tokenDemocraticContractBalance
    };
}

export default connect(mapStateToProps, { setChosenToken, setChosenTokenSymbol } )(ERC20);