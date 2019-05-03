import React from 'react'
import { Switch, Route } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Button, Card, Segment, Grid, Divider } from 'semantic-ui-react'

import MemberCard from '/imports/ui/member/member-card'
import Arrive from '/imports/ui/member/visit/arrive'
import CreatePin from '/imports/ui/visit/create-pin'
import SelectActivity from '/imports/ui/visit/select-activity'
import SignedIn from '/imports/ui/visit/signed-in'

const Main = props => {
  const cancelClick = () => props.history.push('/')
  if (props.loading) return <div>Loading...</div>
  return (
    <Segment>
      <Grid columns={2} style={{ height: '100%' }} verticalAlign="middle">
        <Grid.Column>
          <Card.Group centered>
            <MemberCard className="member-visit-card" {...props.member} onCardClick={f => f} />
          </Card.Group>
        </Grid.Column>
        <Grid.Column>
          <Switch>
            <Route path="/visit/:id/arrive" render={() => <Arrive {...props} />} />
            <Route path="/visit/:id/create-pin" component={CreatePin} />
            <Route path="/visit/:id/select-activity" component={SelectActivity} />
            <Route path="/visit/:id/signed-in" component={SignedIn} />
          </Switch>
          <Button fluid size="large" onClick={cancelClick}>
            Back
          </Button>
        </Grid.Column>
      </Grid>

      <Divider vertical />
    </Segment>
  )
}

Main.propTypes = {
  // member: PropTypes.object.isRequired
}
export default Main
