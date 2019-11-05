import React from 'react';
import '../../css/Smart.css';
import { connect } from 'react-redux';
import { specifyAddress } from '../../stateManagement/actions';

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            address: null,
            errors: { address: '' },
            typed: false
        };
    }

    handleInputChange = (event) => {
        event.preventDefault();
        const { name, value } = event.target;

        let errors = this.state.errors;

        if (name === 'address') {
            if (value.length !== 42) {
                errors.address = 'Address must be 42 characters long';
            } else if (value.charAt(0) !== '0' || value.charAt(1) !== 'x') {
                errors.address = 'Address must start with 0x';
            } else {
                errors.address = '';
            }
        }
        this.setState({errors, [name]: value, typed:true});
    }

    handleSubmit = (event) => {
        event.preventDefault();
        if (this.state.errors.address.length === 0 && this.state.typed === true) {
            this.props.specifyAddress(this.state.address);
            this.props.history.push('/Blockchain/Ether');
        } else {
            console.error('Invalid Form');
        }
    }

    render() {
        const {errors} = this.state;
        return (
            <div id="login" className="smartLogin">
                <form onSubmit={this.handleSubmit}>
                    <p className="smartPLogin">Please enter your Ethereum Address:</p>
                    <input type="text" name="address" onChange={this.handleInputChange} className="smartInputLogin" placeholder="Ethereum Address"/>
                    {errors.address.length > 0 && 
                    <span className='error'>{errors.address}</span>}
                    <button type="submit" className="smartButtonLogin">Login</button>
                </form>
            </div>
        );
    }
}

export default connect(null, { specifyAddress })(Login);