import React, { Component } from 'react';
import '../Smart.css';

class ERC20 extends Component {
	constructor(props) {
	    super(props);
	    this.state = {
	       chosenTokenBalance: 'tokenImperialBalance'
	    }
  	};

    handleChange = (event) => {
        this.setState({chosenTokenBalance: event.target.value});
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
            <p className="smartErcP"> balance: {this.props[this.state.chosenTokenBalance]}</p>
        </div>
      </div>         
      );
  }
}

export default ERC20;
