import React from 'react'
import { Switch, Route, Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Button, Card, Segment, Grid, Icon, Header, Image } from 'semantic-ui-react'

import MemberCard from '/imports/ui/member/member-card'
import CreatePin from '/imports/ui/visit/create-pin'
import SelectActivity from '/imports/ui/visit/select-activity'
import SignedIn from '/imports/ui/visit/signed-in'
import Depart from '/imports/ui/visit/depart'
import SignOut from '/imports/ui/visit/sign-out'
import { VisitContextProvider } from './context'
import { humaniseDate } from '/imports/helpers/dates'
import MemberAddContainer from '/imports/ui/member/member-add-container'

const MembersPortal = props => {
  const backClick = () => props.history.goBack()

  if (props.loading) return <div>Loading...</div>
  if (!props.member._id)
    return (
      <div>
        <Segment>
          <h1>Welcome to Peak Adventures</h1>
          <p>Complete your registration:</p>
          <Button
            onClick={() => {
              props.history.push('/add')
            }}
          >
            Register Your Membership
          </Button>
        </Segment>
      </div>
    )
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
              {/* Peak Adventure Logo  */}
              <Image circular src={props.logo} /> {props.org} Sign {inOut}
            </Header>
            <Switch>{/* Add routes */}</Switch>
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
            {props.member.subsType === 'member' && props.member.status !== 'expired' && (
              <>(expires in {humaniseDate(props.member.expiry)})</>
            )}
            {props.addCard === 1 &&
              (props.member.isHere || window.location.pathname.match(/select-activity$/)) &&
              !props.member.paymentCustId && (
                <span>
                  &nbsp; &nbsp;
                  <Button
                    type="button"
                    size="medium"
                    onClick={() => props.history.push(`/shop/register-card/${props.member._id}`)}
                    style={{ marginTop: '24px', marginLeft: '20px' }}
                    color="green"
                  >
                    <img className="card-mc" src={'/images/visa-mc.jpg'} align="middle" />
                    Please register your credit card
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

MembersPortal.propTypes = {
  member: PropTypes.object.isRequired,
  addCard: PropTypes.number.isRequired,
  logo: PropTypes.string.isRequired,
  org: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired
}

export default MembersPortal
