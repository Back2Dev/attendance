import React from 'react';
import { Component } from 'react';
import { Button, Container } from 'semantic-ui-react'
const debug = require('debug')('b2b:admin')


class AppSelection extends Component {

    render() {
        return (
        <div>
            <Container style={{textAlign: 'center'}}>
                <Button.Group style={{ width: "100%" }} vertical>
                    <Button 
                        onClick={() => { this.props.history.push('/userprofiles') }} 
                        style={{ height: "100px", marginTop: '20px', marginBottom: '20px', borderRadius: "5px" }} 
                        color="grey">
                        <h1>User Profiles</h1>
                    </Button>
                    <Button 
                        onClick={() => { this.props.history.push('/ordering') }}
                        style={{ height: "100px", marginTop: '20px', marginBottom: '20px', borderRadius: "5px" }} 
                        color="teal">
                        <h1>Part Prices</h1>
                    </Button>
                    <Button 
                        onClick={() => { this.props.history.push('/assessment') }}
                        style={{ height: "100px", marginTop: '20px', marginBottom: '20px', borderRadius: "5px" }} 
                        color="blue">
                        <h1>New Bike Assessment</h1>
                    </Button>
                    <Button 
                        onClick={() => { this.props.history.push('/jobs') }}
                        style={{ height: "100px", marginTop: '20px', marginBottom: '20px', borderRadius: "5px" }} 
                        color="green">
                        <h1>Current Jobs</h1>
                    </Button>
                </Button.Group>
            </Container>
        </div>
    )}

}

export default AppSelection