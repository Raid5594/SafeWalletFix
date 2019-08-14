import React, { Component } from 'react';
import Web3 from 'web3';
import './App.css';
import { MULTISIG_ABI, MULTISIG_ADDRESS } from './config';
import SmartContractUI from './SmartContractUI';
import Login from './LoginForm';

class FetchBlockData extends Component {

  componentWillMount() {
    this.loadBlockchainData();
  }

  async loadBlockchainData() {
    const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
    this.setState({ web3 });
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });
    let my = this;
    const multisig = new web3.eth.Contract(MULTISIG_ABI, MULTISIG_ADDRESS);
    this.setState({ multisig });
    web3.eth.getBalance(this.state.account).then(result => {
      my.setState({ etherBalance : result});
      console.log({ etherBalance : result});
    });
    this.state.multisig.methods.balances(this.state.account).call({ from: this.state.account }, function(error, result){
      if (!error) {
        console.log(result);
        my.setState({ balance : result });
      } else {
        console.log(error);
      }
    });
    this.setState({ loading : false });
  }
/*
  componentDidMount() {
    const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
    this.setState({ web3: web3 });
  }*/
  constructor(props) {
    super(props);
    this.state = { 
      account: '',
      web3: '',
      balance: '',
      safetyKey: '',
      loading: true
    };
    this.deposit = this.deposit.bind(this);
    this.depositSafely = this.depositSafely.bind(this);
    this.getSafetyAddress = this.getSafetyAddress.bind(this);
    this.getNonce = this.getNonce.bind(this);
    this.transfer = this.transfer.bind(this);
    console.log(props.etherAddress);
  }

  getEtherBalance = () => {
    this.state.web3.eth.getBalance(this.state.account).then(result => {
      this.setState({ etherBalance : result});
      console.log({ etherBalance : result});
    });
  }

  getContractBalance = () => {
    this.state.multisig.methods.balances(this.state.account).call({ from: this.state.account }, (error, result) => {
        if (!error) {
          console.log(result);
          this.setState({ balance : result });
        }
      });
  }

  async getSafetyAddress(address) {
    let my = this;
    let res = '';
    await this.state.multisig.methods.safetyKeys(address).call({ from: this.state.account }, function(error, result){
        if (!error) {
          res = result;
        }
      });
    return res;
  }

  async getNonce(address) {
    let my = this;
    let res = '';
    await this.state.multisig.methods.transactionNonces(this.state.account).call({ from: this.state.account }, function(error, result){
        if (!error) {
          res = result;
        }
      });
    return res;
  }

  deposit(amount) {
    this.setState({ loading: true })
    console.log({ account : this.state.account, amount : amount })
    this.state.multisig.methods.deposit().send({ value: amount, from: this.state.account })
    .once('receipt', (receipt) => {
      console.log(receipt);    

      this.getEtherBalance();
      this.getContractBalance();
      this.setState({ loading: false })
    })
  }

  depositSafely(amount, address) {
    this.setState({ loading: true })
    this.state.multisig.methods.deposit(address).send({ value: amount, from: this.state.account })
    .once('receipt', (receipt) => {
      console.log(receipt);
    
      this.getEtherBalance();
      this.getContractBalance();
      this.setState({ loading: false })
    })
  }

  transfer(addressTo, amount, signature) {
    this.setState({ loading: true })
    console.log({from: this.state.account, to: addressTo, amount: amount, sig: signature})
    this.state.multisig.methods.verifyTransaction(this.state.account, addressTo, amount, signature).send({from: this.state.account })
    .once('receipt', (receipt) => {
      console.log(receipt);
      
      this.getEtherBalance();
      this.getContractBalance();
      this.setState({ loading: false })
    })
  }


  render() {
    return (
      <div>
        <div className="container-fluid dappMainStyle">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex justify-content-center">
              { this.state.loading 
                ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div> 
                : <SmartContractUI 
                balance={this.state.balance}
                address={this.state.account} 
                safetyKey={this.state.safetyKey}
                deposit={this.deposit}
                depositSafely={this.depositSafely}
                getSafetyAddress={this.getSafetyAddress}
                getNonce={this.getNonce}
                transfer={this.transfer}
                etherBalance={this.state.etherBalance}
                /> 
              }
            </main>
          </div>
        </div>
      </div>  
      );
  }
}

export default FetchBlockData;
