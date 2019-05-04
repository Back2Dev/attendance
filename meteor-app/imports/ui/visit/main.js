import React from 'react'
import { Switch, Route } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Button, Card, Segment, Grid, Divider } from 'semantic-ui-react'

import MemberCard from '/imports/ui/member/member-card'
import Arrive from '/imports/ui/visit/arrive'
import CreatePin from '/imports/ui/visit/create-pin'
import SelectActivity from '/imports/ui/visit/select-activity'
import SignedIn from '/imports/ui/visit/signed-in'
import { VisitContextProvider } from './context'

const Main = props => {
  const cancelClick = () => props.history.push('/')

  if (props.loading) return <div>Loading...</div>
  return (
    <Segment>
      <Grid style={{ height: '100%' }} verticalAlign="middle" divided>
        <Grid.Column width={6}>
          <Card.Group centered>
            <MemberCard className="member-visit-card" {...props.member} onCardClick={f => f} />
          </Card.Group>
        </Grid.Column>
        <Grid.Column width={10}>
          <VisitContextProvider {...props}>
            <Switch>
              <Route path="/visit/:id/arrive" render={() => <Arrive {...props} />} />
              <Route path="/visit/:id/create-pin" component={CreatePin} />
              <Route path="/visit/:id/select-activity" component={SelectActivity} />
              <Route path="/visit/:id/signed-in" component={SignedIn} />
            </Switch>
            <Button fluid size="large" onClick={cancelClick}>
              Back
            </Button>
          </VisitContextProvider>
        </Grid.Column>
      </Grid>
    </Segment>
  )
}

Main.propTypes = {
  // member: PropTypes.object.isRequired
}
export default Main
