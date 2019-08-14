import React from 'react'
import { Switch, Route } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Button, Card, Segment, Grid, Icon, Header, Image } from 'semantic-ui-react'

import MemberCard from '/imports/ui/member/member-card'
import CreatePin from '/imports/ui/visit/create-pin'
import EnterPin from './enter-pin'
import SelectActivity from '/imports/ui/visit/select-activity'
import SignedIn from '/imports/ui/visit/signed-in'
import Depart from '/imports/ui/visit/depart'
import SignOut from '/imports/ui/visit/sign-out'
import { VisitContextProvider } from './context'

const Main = props => {
  const cancelClick = () => props.history.push('/')
  const backClick = () => props.history.goBack()

  if (props.loading) return <div>Loading...</div>
  const inOut = 'in/out'
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
            <Header as="h2">
              <Image circular src={props.logo} /> {props.org} Sign {inOut}
            </Header>
            <Switch>
              <Route path="/visit/:id/arrive" render={() => <EnterPin {...props} next="select-activity" />} />
              <Route path="/visit/:id/create-pin" render={() => <CreatePin {...props} />} />
              <Route path="/visit/:id/select-activity" render={() => <SelectActivity {...props} />} />
              <Route path="/visit/:id/signed-in" render={() => <SignedIn {...props} />} />
              <Route path="/visit/:id/depart" render={() => <Depart {...props} />} />
              <Route path="/visit/:id/sign-out" render={() => <SignOut {...props} />} />
            </Switch>
            {(props.member.isHere || window.location.pathname.match(/select-activity$/)) && (
              <Button
                type="button"
                size="small"
                onClick={() => props.history.push(`/edit/${props.member._id}`)}
                style={{ marginTop: '24px' }}
              >
                Edit your profile
              </Button>
            )}
            {props.addCard === 1 && (props.member.isHere || window.location.pathname.match(/select-activity$/)) && (
              <span>
                &nbsp; &nbsp;
                <Button
                  type="button"
                  size="small"
                  onClick={() => props.history.push(`/shop/register-card/${props.member._id}`)}
                  style={{ marginTop: '24px' }}
                >
                  Add a credit card
                </Button>
              </span>
            )}
            <Button
              floated="right"
              size="small"
              onClick={backClick}
              color="red"
              icon
              inverted
              style={{ marginTop: '24px' }}
            >
              <Icon name="chevron left" />
              Back
            </Button>{' '}
          </VisitContextProvider>
        </Grid.Column>
      </Grid>
    </Segment>
  )
}

Main.propTypes = {
  member: PropTypes.object.isRequired,
  addCard: PropTypes.string.isRequired
}
export default Main
