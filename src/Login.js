import React, { Component } from 'react';
import './Smart.css';

class Login extends React.Component {

  constructor(props) {
  	super(props);
  	this.state = {
 		address: ''
    }
  }

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  setAddress = () => {
  	this.props.setAddress(this.state.address);
  }

  render() {
  	return (
		<div id="login" className="smartLogin">
		  <form onSubmit={this.setAddress}>
			<p className="smartPLogin">Please enter your Ethereum Address:</p>
			<input type="text" name="address" onChange={this.handleInputChange} className="smartInputLogin" placeholder="Ethereum Address" required/>
	        <button type="submit" className="smartButtonLogin">Login</button>
		  </form>
		</div>
	);
  }
}

export default Login;