import React, { Component } from 'react';
import { Button, Col, Form, FormGroup, Input, Container, Media, Modal, ModalHeader, ModalBody, ModalFooter, Row } from 'reactstrap';

class ModalV1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      token: '',
      secret: '',
      notVerified: true,
      goodToken: false
    };

    this.toggle = this.toggle.bind(this);
  	}

  tokenInputHandler = (event) => {
  	this.setState({ token : event.target.value });
  }	

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
      notVerified: true
    }));
  }

  generateSecret = () => {
  	var xhttp = new XMLHttpRequest();
    var data = { address: this.props.address };
    xhttp.onreadystatechange = () => {
            if (xhttp.readyState === 4) { // request is done
                if (xhttp.status === 200) { // successfully
                    var obj = JSON.parse(xhttp.responseText);
                    console.log(obj.secret);
                    this.setState({ secret: obj.secret });
                }
            }
        };
    xhttp.open("POST", "http://localhost:5597/totp-generate", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(data));
  }

  verifyToken = () => {
  	var xhttp = new XMLHttpRequest();
    var data = { 
    	token: this.state.token ,
    	address: this.props.address
    };
    xhttp.onreadystatechange = () => {
            if (xhttp.readyState === 4) { // request is done
                if (xhttp.status === 200) { // successfully
                    var obj = JSON.parse(xhttp.responseText);
                    console.log(obj.verified);
                    this.setState({ goodToken: obj.verified });
                }
            }
        };
    console.log(data);
    xhttp.open("POST", "http://localhost:5596/totp-verify", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(data));
    this.setState({ notVerified : false });
  }

  render() {
  	const externalCloseBtn = <button className="close" style={{ position: 'absolute', top: '15px', right: '15px' }} onClick={this.toggle}>&times;</button>;
  	const verifyTokenBtn = <Container>
		        <Row>
		       	  <Col xs="6">
		            <Input 
		            	type="text" 
		            	name="token" 
		            	placeholder="Token" 
		            	style={{height: "100%", 
							    borderColor: "purple",
							    borderRadius: "2px"}}
						      onChange={this.tokenInputHandler}
						      required
					       />
		          </Col>
		          <Col xs="6">
		        	<Button block onClick={this.verifyToken}>Verify Token</Button>
		          </Col>
		        </Row>
		     </Container>;

    const correctToken = <p className="bg-success">The token submitted is correct.</p>;
    const incorrectToken = <p className="bg-danger">The token submitted is incorrect.</p>;

    return (
      <div>
        <div>
        <button className="smartButtonLong" onClick={() => { this.toggle(); this.generateSecret(); }}>enable two-factor authentication</button>{' '}
        </div> 
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className} external={externalCloseBtn}>
          <ModalHeader>2FA With Google Authenticator</ModalHeader>
          <ModalBody>
	        <Container>
		        <Row>
		          <Col xs="3"></Col>
		          <Col xs="6">
		          	<Media>
			          <Media object src={this.state.secret} alt="Generic placeholder image" />
			        </Media>
		          </Col>
		          <Col xs="3"></Col>
		        </Row>
	        </Container>		              
            { this.state.notVerified ? verifyTokenBtn : 
            	this.state.goodToken ? correctToken : incorrectToken }
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default ModalV1;