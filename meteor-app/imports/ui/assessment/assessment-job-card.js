import React from 'react'
import { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, Button, Container, List } from 'semantic-ui-react'
import "/imports/ui/layouts/assessment.css"


class JobCard extends Component {


    render() {
        const { jobStatus, make, model, color, serviceLevel, pickUp, cost } = this.props.currentJob
        return (
            <Card>
                <Container className="job-card-container" >
                    <Card.Header style={{ textAlign: "Center", fontSize: "1.5em", margin: "10px" }} >
                        {`Job Status: ${jobStatus}`}
                    </Card.Header>
                    <Card.Content style={{ textAlign: "Center", fontSize: "1em" }}>
                        <List>
                            <List.Item>{`Make: ${make}`}</List.Item>
                            <List.Item>{`Model: ${model}`}</List.Item>
                            <List.Item>{`Color: ${color}`}</List.Item>
                            <List.Item>{`Service Level: ${serviceLevel}`}</List.Item>
                            <List.Item>{`Pick-Up Date: ${pickUp}`}</List.Item>
                            <List.Item>{`Total Price: ${cost}`}</List.Item>
                        </List>
                    </Card.Content>
                    <Container style={{ textAlign: "Center" }}>
                        <Button.Group style={{  width: "80%" }} vertical>
                            <Button className="positive ui button"
                            style={{ marginTop: '5px', marginBottom: '5px' }} >
                                <h2>Start Job</h2>
                            </Button>
                            <Button className="positive ui button"
                            style={{ marginTop: '5px', marginBottom: '5px' }} >
                                <h2>Print Job Card</h2>
                            </Button>
                            <Button className="negative ui button"
                            style={{ marginTop: '5px', marginBottom: '5px' }} >
                                <h2>Cancel Job</h2>
                            </Button>
                        </Button.Group>
                    </Container>
                </Container>
            </Card>

    )}
}


export default JobCard