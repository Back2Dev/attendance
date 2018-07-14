import React, { Fragment } from 'react'
import { withRouter } from 'react-router-dom'
import { Grid } from 'semantic-ui-react'
//import your components here 

class OrderingMain extends React.Component {

  render() {
    return (
      <Grid>
        <Grid.Row>
            
          <Grid.Column width='13'>
            <div><h1>Hi</h1></div>

          </Grid.Column>

        </Grid.Row>

      </Grid>
    )
  }
}

export default withRouter(OrderingMain)
