import React from 'react'
import CheckinList from '../components/CheckinList'
import CheckedInList from '../components/CheckedInList'

import { Grid } from 'semantic-ui-react'

const AttendanceApp = (props) => {
  return (
    <Grid columns='equal' centered>

      <Grid.Row centered>
      
        <Grid.Column stretched>
          <CheckinList />
        </Grid.Column>

        <Grid.Column stretched>
          <CheckedInList />         
        </Grid.Column>

      </Grid.Row> 
    </Grid>
  )
}

export default AttendanceApp
