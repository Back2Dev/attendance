import React from 'react';
import { Component } from 'react';
import { Button, Container, Image } from 'semantic-ui-react'
import '/imports/ui/layouts/assessment.css'


class Congratulations extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
        <div className="bimage" style={{ height: "500px" }}> 
            <Container style={{ marginTop: '100px' }}>
                <Container style={{ marginTop: '30px' }}>
                    <h1> Your job order has been placed and will be completed and ready for pick up by: </h1>
                </Container>
                <Container style={{textAlign: 'center'}}>
                    <Button.Group>
                        <Button 
                            onClick={() => { this.props.history.push('/assessment') }} // This will be a print the job card with all of it's details populated
                            color="green" style={{ marginTop: '60px', marginRight: '20px', marginLeft: '20px' }}> 
                            <h1>Print Job Card</h1>
                        </Button>
                        <Button
                            onClick={() => { this.props.history.push('/jobs') }}
                            color="green" style={{ marginTop: '60px', marginRight: '20px', marginLeft: '20px' }}>
                            <h1>View Current Jobs</h1>
                        </Button>
                    </Button.Group>
                </Container>
            </Container>
        </div>
        )}
}

export default Congratulations