import React, { Component } from 'react';
import Login from './containerComponents/Login.js';
import BlockchainData from './containerComponents/BlockchainData.js';
import { connect } from 'react-redux';

import './css/App.css';

class App extends Component {

    render() {
        return (
            <div>
               { this.props.login ? <BlockchainData/> : <Login/>}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return { 
        login: state.data.login
    };
}

export default connect(mapStateToProps)(App);