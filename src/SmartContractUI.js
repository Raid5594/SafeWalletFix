import React, { Component } from 'react';
import './Smart.css';
import Modal from './ModalV1';
import ModalToken from './Modal';
import ModalNonce from './ModalNonce';
import ModalSafetyAddr from './ModalSafetyAddress';
import EthCrypto from 'eth-crypto';

class SmartContractUI extends Component {

  constructor(props) {
    super(props);
    this.state = {
      safeAmount: '',
      safeAddress: '',
      safePrivate: '',
      sendAmount: '',
      sendAddress: '',
      tokenTFA: '',
      currentValue: '',
      amountDeposit: '',
      addressToCheck: '',
      amountSafeDeposit: '',
      addressSafeAccount: '',
      nonce: ''
    }
  };
   

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  depositEther = (event) => {
    event.preventDefault();
    console.log(this.state.amountDeposit);
    this.props.deposit(this.state.amountDeposit);
  }

  getSafetyAddress = (event) => {
    event.preventDefault();
    this.props.getSafetyAddress(this.state.addressToCheck).then((result) => {
      alert(result);
    });
  }

  getSafetyAddressv1 = (event) => {
    event.preventDefault();
    let my = this;
    this.props.getSafetyAddress(this.state.addressToCheck).then((result) => {
      my.setState({addr: result});
      console.log(my.state.addr);
    });
  }
  safeDeposit = (event) => {
    event.preventDefault();
    this.props.depositSafely(this.state.amountSafeDeposit, this.state.addressSafeAccount);
  }

  sendEther = (event) => {
    event.preventDefault();
    var amount = this.state.sendAmount;
    var addr = this.state.sendAddress;
    var token = this.state.tokenTFA;

    this.props.getNonce().then((result) => {
      var xhttp = new XMLHttpRequest();
      var nonce = result;
      console.log(nonce);
      console.log(addr)
      console.log(amount);
      var data =
      { addressFrom: this.props.address,
        addressTo: addr, 
        amount: amount,
        nonce: nonce,
        token: token
      };
      xhttp.onreadystatechange = () => {
              if (xhttp.readyState === 4) { // request is done
                  if (xhttp.status === 200) { // successfully
                      var obj = JSON.parse(xhttp.responseText);
                      if (obj.verified) {
                        console.log({ 
                          addressFrom: this.props.address,
                          addressTo: addr, 
                          amount: amount, 
                          signature: obj.signature});
                          this.props.transfer(addr, amount, obj.signature);
                      } else {
                        alert("Wrong Token Submitted");
                      }   
                  }
              }
          };
      xhttp.open("POST", "http://localhost:5597/submit-transaction", true);
      xhttp.setRequestHeader("Content-Type", "application/json");
      xhttp.send(JSON.stringify(data));
    })
  }

  sendSafeTransacton = (event) => {
    event.preventDefault();
    let addrFrom = this.props.address;
    let addrTo = this.state.safeAddress;
    let value = this.state.safeAmount;
    let priv = this.state.safePrivate;

    this.props.getNonce().then((result) => {
      var nonce = result;

      let msg = [
        { type: "address", value: addrFrom},
        { type: "address", value: addrTo},
        { type: "uint256", value: value.toString()},
        { type: "uint256", value: nonce.toString()}
      ];

      const message = EthCrypto.hash.keccak256(msg);
      const signature = EthCrypto.sign(priv, message);

      console.log(`message: ${message}`);
      console.log(`signature: ${signature}`);
      
      console.log({ 
          addressFrom: addrFrom,
          addressTo: addrTo, 
          amount: value, 
          signature: signature });

      this.props.transfer(addrTo, value, signature);
    });
  }


  render() {

    return (
      <div id="content" className ="smart">

        <p className="smartP"> Your address: {this.props.address}</p>
        <p className="smartP"> Ether balance (wei): {this.props.etherBalance}</p>
        <p className="smartP"> Contract balance (wei): {this.props.balance}</p>

        <form onSubmit={this.depositEther}>
          <input type="text" name="amountDeposit" onChange={this.handleInputChange} className="smartInput" placeholder="Amount to deposit" required/>
          <button type="submit" className="smartButton">deposit ether</button>
        </form>

        <ModalSafetyAddr getSafetyAddress={this.props.getSafetyAddress}/>

        <form onSubmit={this.safeDeposit}>
         <input type="text" name="amountSafeDeposit" onChange={this.handleInputChange} className="smartInput2" placeholder="Amount to deposit" required/>
         <input type="text" name="addressSafeAccount" onChange={this.handleInputChange} className="smartInput2" placeholder="Safety public key" required/>
         <button type="submit" className="smartButton">safe deposit</button>
        </form>

        <form onSubmit={this.sendEther}>
         <input type="text" name="sendAmount" onChange={this.handleInputChange} className="smartInput3" placeholder="Amount to send" required/>
         <input type="text" name="sendAddress" onChange={this.handleInputChange} className="smartInput3" placeholder="Recipient" required/>
         <input type="text" name="tokenTFA" onChange={this.handleInputChange} className="smartInput3" placeholder="Token" required/>
         <button type="submit" className="smartButton">Send Ether</button>
        </form>

        <form onSubmit={this.sendSafeTransacton}>
          <input type="text" name="safeAmount" onChange={this.handleInputChange} className="smartInput3" placeholder="Amount to send" required/>
          <input type="text" name="safeAddress" onChange={this.handleInputChange} className="smartInput3" placeholder="Address" required/>
          <input type="text" name="safePrivate" onChange={this.handleInputChange} className="smartInput3" placeholder="Private Key" required/>
          <button type="submit" className="smartButton">send safely</button>
        </form>

        <div>
          <ModalNonce nonce={this.props.nonce} getNonce={this.props.getNonce}/>
        </div>
        <div>
          <ModalToken address={this.props.address}/> 
        </div>

      </div>         
      );
  }
}

export default SmartContractUI;
