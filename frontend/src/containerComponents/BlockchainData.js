import React, { Component } from 'react';
import Web3 from 'web3';
import { MULTISIG_ABI, MULTISIG_ADDRESS, MULTISIG_ERC20_ABI, MULTISIG_ERC20_ADDRESS, ERC20_ABI, 
	TOKENIMPERIAL_ADDRESS, TOKENDEMOCRATIC_ADDRESS, TOKENIMPERIAL_SYMBOL, TOKENDEMOCRATIC_SYMBOL } from '../config';
import SmartContract from './multisigEtherWallet/SmartContract'; 
import ERC20 from './erc20/ERC20';
import '../css/ButtonGroup.css';
import { connect } from 'react-redux';
import { setWeb3, setMultisig, setMultisigAddress, setMultisigERC, 
	setTokenImperial, setTokenDemocratic, updateEtherBalance, 
	updateContractBalance, updateTokenImperialBalance, updateTokenDemocraticBalance,
	updateTokenImperialContractBalance, updateTokenDemocraticContractBalance, setUpdateBalancesEther,
	setUpdateBalancesERC, setMultisigERC20Address } from '../redux/actions';


/* Validate forms, clear data in forms, check that transaction transfer works correctly*/ 
class BlockchainData extends Component {

	constructor(props) {
		super(props);
		this.state = {
			Ethereum: true
		};
	}

	componentDidMount() {

		const web3 = new Web3('https://ropsten.infura.io/v3/a33baa265ae340c29c82373e91533edf');
		this.props.setWeb3(web3);

		const multisig = new web3.eth.Contract(MULTISIG_ABI, MULTISIG_ADDRESS);
		this.props.setMultisig(multisig);
		this.props.setMultisigAddress(MULTISIG_ADDRESS);

		const multisigERC20 = new web3.eth.Contract(MULTISIG_ERC20_ABI, MULTISIG_ERC20_ADDRESS);
		this.props.setMultisigERC(multisigERC20);
		this.props.setMultisigERC20Address(MULTISIG_ERC20_ADDRESS);

		const tokenImperial = new web3.eth.Contract(ERC20_ABI, TOKENIMPERIAL_ADDRESS);
		this.props.setTokenImperial(tokenImperial);

		const tokenDemocratic = new web3.eth.Contract(ERC20_ABI, TOKENDEMOCRATIC_ADDRESS);
		this.props.setTokenDemocratic(tokenDemocratic);

		this.updateBalances(multisig);
		this.updateERCBalances(tokenImperial, tokenDemocratic, multisigERC20);

		this.props.setUpdateBalancesEther(this.updateBalances);
		this.props.setUpdateBalancesERC(this.updateERCBalances);

		//this.interval = setInterval(this.updateBalances(multisig), 1000);
		//this.interval = setInterval(this.updateERCBalances(tokenImperial, tokenDemocratic, multisigERC20), 1000);
	}

	componentWillUnmount() {
		clearInterval(this.interval);
	}

	updateBalances = (multisig) => {
		let etherBalance = null;
		let contractBalance = null
		multisig.methods.balances(this.props.etherAddress).call({ from: this.props.etherAddress }, (error, balance) => {
			if (error) {
				console.log(error);
			} else {
				contractBalance = balance;
				this.props.web3.eth.getBalance(this.props.etherAddress, (error, balance) => {
					if (error) {
						console.log(error, 'Something went wrong');
					} else {
						etherBalance = balance;
						this.props.updateEtherBalance(etherBalance);
						this.props.updateContractBalance(contractBalance);
					}
				});
			}
		});
	}
	updateERCBalances = (tokenImperial, tokenDemocratic, multisigERC20) => {

		tokenImperial.methods.balanceOf(this.props.etherAddress).call({from: this.props.etherAddress}, (error, balance) => {
			if (error) {
				console.log(error);
			} else {
				this.props.updateTokenImperialBalance(balance);
			}
		});

		tokenDemocratic.methods.balanceOf(this.props.etherAddress).call({from: this.props.etherAddress}, (error, balance) => {
			if (error) {
				console.log(error);
			} else {
				this.props.updateTokenDemocraticBalance(balance);
			}
		});

		multisigERC20.methods.tokenBalances(this.props.etherAddress, TOKENIMPERIAL_SYMBOL).call({from: this.props.etherAddress}, (error, balance) => {
			if (error) {
				console.log(error);
			} else {
				this.props.updateTokenImperialContractBalance(balance);
			}
		});

		multisigERC20.methods.tokenBalances(this.props.etherAddress, TOKENDEMOCRATIC_SYMBOL).call({from: this.props.etherAddress}, (error, balance) => {
			if (error) {
				console.log(error);
			} else {
				this.props.updateTokenDemocraticContractBalance(balance);
			}
		});
	}

	onHandleClick = (e) => {
		e.preventDefault();
		var current = document.getElementsByClassName('active');
		current[0].className = current[0].className.replace(' active', '');
		e.target.className += ' active';
		const name = e.target.name;

		switch (name) {
		case 'Ethereum': 
		if (this.state.Ethereum !== true) {
			this.setState({ 'Ethereum': true });
			}
			break;
		case 'ERC20': 
		if (this.state.Ethereum === true) {
			this.setState({ 'Ethereum': false });
			}
			break;   
			default:
			break;
		}
	}

	render() {
		return (
			<div id="content" className ="smart">
				<div className="btnGroup">
					<button className="buttonInGroup active" name="Ethereum" onClick={this.onHandleClick}>Ethereum</button>
					<button className="buttonInGroup" name="ERC20" onClick={this.onHandleClick}>ERC20</button>
				</div>
				{
				this.state.Ethereum ? 
				<SmartContract />
				:
				<ERC20 />
				}
			</div>  
		);
  }
}

function mapStateToProps(state) {
	return { 
		etherAddress: state.data.etherAddress,
		web3: state.data.web3,
		multisig: state.data.multisig,
		multisigERC20: state.data.multisigERC20,
		tokenImperial: state.data.tokenImperial,
		tokenDemocratic: state.data.tokenDemocratic,
		etherBalance: state.data.etherBalance,
		contractBalance: state.data.contractBalance,
		tokenImperialBalance: state.data.tokenImperialBalance,
		tokenDemocracticBalance: state.data.tokenDemocracticBalance,
		tokenImperialContractBalance: state.data.tokenImperialContractBalance,
		tokenDemocraticContractBalance: state.data.tokenDemocraticContractBalance
	};
}

export default connect(mapStateToProps, { setWeb3, setMultisig, setMultisigAddress, setMultisigERC, 
	setTokenImperial, setTokenDemocratic, updateEtherBalance, 
	updateContractBalance, updateTokenImperialBalance, updateTokenDemocraticBalance,
	updateTokenImperialContractBalance, updateTokenDemocraticContractBalance, setUpdateBalancesEther,
	setUpdateBalancesERC, setMultisigERC20Address })(BlockchainData);
