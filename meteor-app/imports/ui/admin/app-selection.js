import React from 'react';
import { Component } from 'react';
import { Button, Container } from 'semantic-ui-react'
import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import Alert from 'react-s-alert';
const debug = require('debug')('att:admin')

// const ButtonExampleEmphasis = () => (
//   <div>
//     <Button primary>Primary</Button>
//     <Button secondary>Secondary</Button>
//   </div>
// )


class AppSelection extends Component {

    render() {
        return (
        <div>
            <Container style={{textAlign: 'center'}}>
                <Button.Group style={{ width: "100%" }} vertical>
                    <Button style={{ height: "100px", marginTop: '20px', marginBottom: '20px' }} color="grey"><h1>User Profiles</h1></Button>
                    <Button style={{ height: "100px", marginTop: '20px', marginBottom: '20px' }} color="teal"><h1>Part Prices</h1></Button>
                    <Button style={{ height: "100px", marginTop: '20px', marginBottom: '20px' }} color="blue"><h1>New Bike Assessment</h1></Button>
                    <Button style={{ height: "100px", marginTop: '20px', marginBottom: '20px' }} color="green"><h1>Current Jobs</h1></Button>
                </Button.Group>
            </Container>
        </div>
    )}

}

export default AppSelection