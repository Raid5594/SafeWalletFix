import React, { Component } from 'react';
import { Login, BlockchainData } from './components';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import './css/App.css';

class App extends Component {

    render() {
        return (
            <Router>
                <div>
                   { this.props.login ? 
                       <Route path = '/Blockchain/' component={BlockchainData} /> : 
                       <Route path = '/' component={Login} /> }
                </div>
            </Router>
        );
    }
}

function mapStateToProps(state) {
    return { 
        login: state.data.login
    };
}

export default connect(mapStateToProps)(App);