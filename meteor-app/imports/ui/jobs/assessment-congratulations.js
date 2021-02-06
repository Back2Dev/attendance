import React, { Component }  from 'react'
import { Button, Grid} from 'semantic-ui-react'
import { withRouter } from 'react-router-dom'
import printJobCard from '/imports/ui/assessment/assessment-print-job'
import '/imports/ui/layouts/assessment.css'

class Congratulations extends Component {
    
    render() {
        const pickUpDate = this.props.formData.pickUpDate
        return (
            <Grid.Column style={{ width: "100%" }}>
                <Grid.Row style={{ marginTop: '30px', textAlign: 'center' }}>
                    <h1> Congratulations! </h1>
                    <h1> Your job order has been placed and be ready for pick up by: </h1>
                    <h1> { pickUpDate } </h1>
                </Grid.Row>
                <Grid.Row style={{textAlign: 'center'}}>
                        <Button color="green" style={{ marginTop: '60px', marginRight: '20px', marginLeft: '20px' }}
                        onClick={ () => printJobCard(this.props.assessmentLastSaved)}>
                        <h1>Print Job</h1>
                        </Button>
                        <Button
                            onClick={() => { this.props.history.push('/jobs') }}
                            color="green" style={{ marginTop: '60px', marginRight: '20px', marginLeft: '20px' }}>
                            <h1>View Current Jobs</h1>
                        </Button>
                </Grid.Row>
            </Grid.Column>
        )}
}



export default withRouter(Congratulations)