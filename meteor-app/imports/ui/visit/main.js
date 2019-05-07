import React from 'react'
import { Switch, Route } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Button, Card, Segment, Grid, Icon } from 'semantic-ui-react'

import MemberCard from '/imports/ui/member/member-card'
import Arrive from '/imports/ui/visit/arrive'
import CreatePin from '/imports/ui/visit/create-pin'
import SelectActivity from '/imports/ui/visit/select-activity'
import SignedIn from '/imports/ui/visit/signed-in'
import Depart from '/imports/ui/visit/depart'
import SignOut from '/imports/ui/visit/sign-out'
import { VisitContextProvider } from './context'

const Main = props => {
  const cancelClick = () => props.history.push('/')
  const backClick = () => props.history.goBack()

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
              <Route path="/visit/:id/create-pin" render={() => <CreatePin {...props} />} />
              <Route path="/visit/:id/select-activity" render={() => <SelectActivity {...props} />} />
              <Route path="/visit/:id/signed-in" render={() => <SignedIn {...props} />} />
              <Route path="/visit/:id/depart" render={() => <Depart {...props} />} />
              <Route path="/visit/:id/sign-out" render={() => <SignOut {...props} />} />
            </Switch>
            <Button fluid size="large" onClick={backClick} color="red" icon inverted style={{ marginTop: '24px' }}>
              <Icon name="chevron left" />
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
