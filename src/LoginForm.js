import React from "react";
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBInput, MDBBtn, MDBIcon, MDBModalFooter } from 'mdbreact';

class SignIn extends React.Component {

  render() {
    return (
      <div>     
        <MDBInput
          label="Your public key"
          group
          type="email"
          validate
          error="wrong"
          success="right"
        />
        <MDBInput
          label="Your password"
          group
          type="password"
          validate
          containerClass="mb-0"
        />
        <div className="text-center mb-3">
          <MDBBtn
            type="button"
            gradient="blue"
            rounded
            className="btn-block z-depth-1a"
          >
            Sign in
          </MDBBtn>
        </div>
      </div>
    );
  }
}

class SignUp extends React.Component {

  render() {
    return (
      <div>     
        <MDBInput
          label="Your public key"
          group
          type="email"
          validate
          error="wrong"
          success="right"
        />
        <MDBInput
          label="Your password"
          group
          type="password"
          validate
          containerClass="mb-0"
        />
        <div className="text-center mb-3">
          <MDBBtn
            type="button"
            gradient="blue"
            rounded
            className="btn-block z-depth-1a"
          >
            Sign up
          </MDBBtn>
        </div>
      </div>
    );
  }
}

class FormPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoginOpen: true,
      isRegisterOpen: false
    };
  }

  showLoginBox() {
      this.setState({isLoginOpen: true, isRegisterOpen: false});
    }

  showRegisterBox() {
      this.setState({isRegisterOpen: true, isLoginOpen: false});
    }

  render() {
    return (
      <MDBContainer className="d-flex justify-content-center col-12">
        <MDBRow>
          <MDBCol md="12">
            <MDBCard>
              <MDBCardBody className="mx-4">
                <div className="row my-3 d-flex justify-content-center">
                  <MDBBtn
                    type="button"
                    gradient="white"
                    rounded
                    className="z-depth-1a blue-text"
                    onClick={this
                     .showLoginBox
                     .bind(this)}
                  >
                    <font size="4">Sign in</font>
                  </MDBBtn>
                  <MDBBtn
                    type="button"
                    color="white"
                    rounded
                    className="z-depth-1a blue-text"
                    onClick={this
                     .showRegisterBox
                     .bind(this)}
                  >
                    <font size="4">Sign up</font>
                  </MDBBtn>
                </div>
                { this.state.isLoginOpen && <SignIn /> }
                { this.state.isRegisterOpen && <SignUp /> }
              </MDBCardBody>
              
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    );
  }
}

export default FormPage;