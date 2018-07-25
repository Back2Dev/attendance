import React from "react";
import { Component } from "react";
import { Button, Container } from "semantic-ui-react";
import UploadXL from "/imports/ui/ordering/uploadXL";
import { Meteor } from 'meteor/meteor'
import Alert from 'react-s-alert';

const debug = require("debug")("b2b:admin");

class AppSelection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addParts: true
    };
    this.toggleAddPart = this.toggleAddPart.bind(this);
    this.uploadXL = this.uploadXL.bind(this);
  }
  toggleAddPart() {
    this.setState({ addParts: !this.state.addParts });
  }
  uploadXL(e) {
    
    e.preventDefault()
    
    const input = e.target[0]
    input.files[0] ? alert(`Adding your parts`) : alert(`Oops! Forgot to add the file? Try again uploading the file`)
    const reader = new FileReader()
    reader.onloadend = function () {
      const data = reader.result
      Meteor.callAsync('parts.load', data)
    }
    reader.readAsBinaryString(input.files[0])
  }

  render() {
    return (
      <div>
        <Container style={{ textAlign: "center" }}>
          <Button.Group style={{ width: "100%" }} vertical>
            <Button
              onClick={() => {
                this.props.history.push("/userprofiles");
              }}
              style={{
                height: "100px",
                marginTop: "20px",
                marginBottom: "20px"
              }}
              color="grey"
            >
              <h1>User Profiles</h1>
            </Button>
            <Button
              onClick={() => {
                this.props.history.push("/ordering");
              }}
              style={{
                height: "100px",
                marginTop: "20px",
                marginBottom: "20px"
              }}
              color="teal"
            >
              <h1>Part Prices</h1>
            </Button>
            <Button
              onClick={() => {
                this.props.history.push("/assessment");
              }}
              style={{
                height: "100px",
                marginTop: "20px",
                marginBottom: "20px"
              }}
              color="blue"
            >
              <h1>New Bike Assessment</h1>
            </Button>
            <Button
              onClick={() => {
                this.props.history.push("/jobs");
              }}
              style={{
                height: "100px",
                marginTop: "20px",
                marginBottom: "20px"
              }}
              color="green"
            >
              <h1>Current Jobs</h1>
            </Button>

            <Button
              onClick={this.toggleAddPart}
              style={{
                height: "100px",
                marginTop: "20px",
                marginBottom: "20px"
              }}
              color="grey"
            >
              <h1>Add updated pricelist</h1>
            </Button>
            
            {this.state.addParts ? '' : <UploadXL uploadXL={this.uploadXL} toggleAddPart={this.toggleAddPart} />}
     
          </Button.Group>
        </Container>
      </div>
    );
  }
}

export default AppSelection;
