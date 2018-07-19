import React from 'react'
import { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, Button, Container } from 'semantic-ui-react'
import "/imports/ui/layouts/assessment.css"


class JobCard extends Component {


    render() {
        return (
            <div>
                <Card>
                    <Container className="job-card-container" >
                        <Card.Header style={{ textAlign: "Center" }} >
                           <h1>Job Status:</h1>
                        </Card.Header>
                        <Card.Content style={{ textAlign: "Center" }}>
                            <h3> Make: Toyota </h3>
                            <h3> Model: Corolla </h3>
                            <h3> Colour: Blue </h3>
                            <h3> Service Level: Minor</h3>
                            <h3> Pick-Up Date: 17/09/2018 </h3>
                            <h3> Total Price ($): 40 </h3>
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
            </div>

        )}
    }


export default JobCard