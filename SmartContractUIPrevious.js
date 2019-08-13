import React, { Component } from 'react';
import './Smart.css';
import Modal from './ModalV1';
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
      tokenTFA: ''
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

  sendSafeTransacton = (event) => {
    event.preventDefault();
    let addr = this.state.safeAddress;
    let value = this.state.safeAmount;
    let priv = this.state.safePrivate;

    console.log(addr);
    this.props.getNonce().then((result) => {
      var xhttp = new XMLHttpRequest();
      var nonce = result;
      console.log(nonce);
      console.log(addr)
      console.log(value);

      let msg = [
        { type: "address", value: addr},
        { type: "uint256", value: value.toString()},
        { type: "uint256", value: nonce.toString()}
      ];

      const message = EthCrypto.hash.keccak256(msg);
      const signature = EthCrypto.sign(priv, message);

      console.log(`message: ${message}`);
      console.log(`signature: ${signature}`);
      
      console.log({ 
          addressFrom: this.props.address,
          addressTo: addr, 
          amount: value, 
          signature: signature });

      this.props.transfer(addr, value, signature);
    });
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
      xhttp.open("POST", "http://localhost:5596/submit-transaction", true);
      xhttp.setRequestHeader("Content-Type", "application/json");
      xhttp.send(JSON.stringify(data));
    })
  }

  render() {
    let my = this;
    function handleClick(e) {
      e.preventDefault();
      my.props.getNonce().then(result => { alert(result); 
      });
    }

    const inputStyle = {
      height: "100%", 
      borderColor: "purple",
      borderRadius: "2px"
    }

    const pStyle = {
      fontFamily: 'courier', 
      border: '1px solid rgb(2, 117, 255)', 
      padding: '10px',   
      borderRadius: '2px' 
    }
    return (
      <div id="content">
        <div className ="container smart">
          <div className="row">
            <div className="col">
              <p style={pStyle}> Your address:{this.props.address}</p>
            </div>
          </div>

          <div className="row">
            <div className="col">
              <p style={pStyle}> Ether balance (wei):{this.props.etherBalance}</p>
            </div>
          </div>

          <div className="row">
            <div className="col">
              <p style={pStyle}> Contract balance (wei):{this.props.balance}</p>
            </div>
          </div>
        
        <form 
          className="form-row"
          onSubmit={(event) => {
            event.preventDefault();
            console.log(this.amountDeposit.value);
            this.props.deposit(this.amountDeposit.value);
          }}>
            <div className="col-8 input-group mb-2">
              <input 
                ref={(input) => 
                  this.amountDeposit = input
                }
                type="text" 
                className="form-control" 
                id="inputAmount" 
                placeholder="Amount to deposit"
                style={inputStyle}
                required/>
            </div>
            <div className="col-4">
              <button type="submit" className="btn btn-outline-primary mb-2 btn-block" >Deposit Ether</button>
            </div>
        </form>

        <form 
          onSubmit = {(event) => {
            event.preventDefault();
            this.props.getSafetyAddress(this.addressToCheck.value).then((result) => {
              alert(result);
            });
          }}>
          <div className="form-row">
            <div className="col-8 input-group mb-2">
              <input 
                ref={(input) => 
                  this.addressToCheck = input
                }
                type="text" 
                className="form-control" 
                id="addressAccToCheck" 
                placeholder="Address of account"
                style={inputStyle}
                required/>
            </div>
            <div className="col-4">
              <button type="submit" className="btn btn-outline-primary mb-2 btn-block" >Safe Address</button>
            </div>
          </div> 
        </form>
        
        <form 
          onSubmit={(event) => {
            event.preventDefault();
            this.props.depositSafely(this.amountDepositSafely.value, this.addressSafe.value);
          }}>
          <div className="form-row">
            <div className="col-4 input-group mb-2">
              <input 
                ref={(input) => 
                  this.amountDepositSafely = input
                }
                type="text" 
                className="form-control" 
                id="inputAmount2" 
                placeholder="Amount to deposit"
                style={inputStyle}
                required/>
            </div>
            <div className="col-4 input-group mb-2">
              <input 
                ref={(input) => 
                  this.addressSafe = input
                }
                type="text" 
                className="form-control" 
                id="addressSafe" 
                placeholder="Safety public address"
                style={inputStyle}
                required/>
            </div>
            <div className="col-4">
             <button type="submit" className="btn btn-outline-primary mb-2 btn-block">Safe Deposit</button>
            </div>
          </div>
        </form>

        <form 
          onSubmit={(event) => {
            event.preventDefault();
            var addr = this.addressSend.value;
            var amount = this.amountSend.value;
            var token = this.tokenTFA.value;
            var my = this;

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
            xhttp.onreadystatechange = function() {
                    if (xhttp.readyState === 4) { // request is done
                        if (xhttp.status === 200) { // successfully
                            var obj = JSON.parse(xhttp.responseText);
                            if (obj.verified) {
                              console.log({ 
                                addressFrom: my.props.address,
                                addressTo: addr, 
                                amount: amount, 
                                signature: obj.signature});
                                my.props.transfer(addr, amount, obj.signature);
                            } else {
                              alert("Wrong Token Submitted");
                            }   
                        }
                    }
                };
            xhttp.open("POST", "http://localhost:5596/submit-transaction", true);
            xhttp.setRequestHeader("Content-Type", "application/json");
            xhttp.send(JSON.stringify(data));
            })
          }}>
          <div className="form-row">
            <div className="col-3 input-group mb-2">
              <input 
                ref={(input) => 
                  this.amountSend = input
                }
                type="text" 
                className="form-control" 
                id="sendAmount" 
                placeholder="Amount to send"
                style={inputStyle}
                required/>
            </div>
            <div className="col-3 input-group mb-2">
              <input 
                ref={(input) => 
                  this.addressSend = input
                }
                type="text" 
                className="form-control" 
                id="addressTrasnfer" 
                placeholder="Address of recipient"
                style={inputStyle}
                required/>
            </div>
            <div className="col-2 input-group mb-2">
              <input 
                ref={(input) => 
                  this.tokenTFA = input
                }
                type="text" 
                className="form-control" 
                id="tokenTFA" 
                placeholder="Token"
                style={inputStyle}
                required/>
            </div>
            <div className="col-4">
             <button type="submit" className="btn btn-outline-primary mb-2 btn-block">Send Ether</button>
            </div>
          </div>
        </form>

        <form>
         <input type="text" name="sendAmount" onChange={this.handleInputChange} className="smartInput3" placeholder="Amount to send" required/>
         <input type="text" name="sendAddress" onChange={this.handleInputChange} className="smartInput3" placeholder="Recipient" required/>
         <input type="text" name="tokenTFA" onChange={this.handleInputChange} className="smartInput3" placeholder="Token" required/>
         <button type="button" onClick={this.sendEther} className="smartButton">Send Ether</button>
        </form>

        <form>
         <input type="text" name="safeAmount" onChange={this.handleInputChange} className="smartInput3" placeholder="Amount to send" required>
         </input>
         <input type="text" name="safeAddress" onChange={this.handleInputChange} className="smartInput3" placeholder="Address" required>
         </input> 
         <input type="text" name="safePrivate" onChange={this.handleInputChange} className="smartInput3" placeholder="Private Key" required>
         </input> 
         <button type="button" onClick={this.sendSafeTransacton} className="smartButton">
          send safely
         </button>
        </form>

        <div>
             <button onClick={handleClick} className="smartButtonLong">Check Current Nonce</button>
        </div>

        <div>
        <Modal address={this.props.address}/>
        </div>

       </div>         
      </div>         
      );
  }
}

export default SmartContractUI;
