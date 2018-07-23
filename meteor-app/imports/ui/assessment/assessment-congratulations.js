import React, { Component }  from 'react'
import { Button, Grid} from 'semantic-ui-react'
import { withRouter } from 'react-router-dom'
import PrintJobCard from 'imports/ui/assessment/assessment-print-job-card'
import '/imports/ui/layouts/assessment.css'

class Congratulations extends Component {
    
    render() {
        return (
            <Grid.Column className="background-image" style={{ minHeight: '800px', width: "100%" }}>
                <Grid.Row style={{ marginTop: '30px', textAlign: 'center' }}>
                    <h1> Your job order has been placed and be ready for pick up by: </h1>
                    <h1> 17/08/2018 </h1>
                </Grid.Row>
                <Grid.Row style={{textAlign: 'center'}}>
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
                </Grid.Row>
            </Grid.Column>
        )}
}

export default withRouter(Congratulations)