import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Button, Card, Segment, Grid, Header, Image, Container, Icon } from 'semantic-ui-react'
import MembershipCard from '/imports/ui/member-card/member-card'
import MultiVisitsCard from '/imports/ui/punch-card/multi-visits-card'
import MemberVisitsCard from '/imports/ui/punch-card/member-visits-card'
import { startOfDay } from 'date-fns'

const MemberPortal = props => {
  if (props.loading) return <div>Loading...</div>

  return (
    <Segment>
      <Header as="h1" style={{ textAlign: 'center' }}>
        <Image circular src={props.logo} /> {props.org}
      </Header>
      <Grid.Column width={6}>
        <Card.Group style={{ paddingBottom: '20px' }}>
          <MembershipCard className="member-visit-card" member={props.member} />)
        </Card.Group>
      </Grid.Column>
      <Button type="button" onClick={() => props.toEdit()} style={{ height: '50px' }}>
        Edit your profile
      </Button>
      {props.addCard === 1 && !props.member.paymentCustId ? (
        <Button
          type="button"
          color="green"
          onClick={() => props.history.push(`/shop/register-card/${props.member._id}`)}
          style={{ height: '50px' }}
        >
          <Icon name="credit card" />
          Register your credit card
        </Button>
      ) : null}
      {props.cart && (
        <Button
          style={{ height: '50px' }}
          color="red"
          onClick={() => props.history.push(`/shop/renew/${props.member._id}/${props.cart._id}`)}
        >
          Pay Now
        </Button>
      )}
      <Container style={{ display: 'flex', flexWrap: 'wrap' }}>
        {props.purchases &&
          props.purchases.map(purchase => {
            if (purchase.code === 'PA-PASS-MULTI-10') {
              return (
                <MultiVisitsCard
                  usedVisits={purchase.sessions.length}
                  totalVisits={purchase.sessions.length + purchase.remaining}
                  paid={purchase.paymentStatus === 'paid'}
                />
              )
            } else if (purchase.code.includes('PA-MEMB')) {
              return (
                <MemberVisitsCard
                  startDate={purchase.createdAt}
                  expiryDate={purchase.expiry}
                  paid={purchase.paymentStatus === 'paid'}
                  sessions={purchase.sessions}
                />
              )
            }
          })}
      </Container>
    </Segment>
  )
}

MemberPortal.propTypes = {
  cart: PropTypes.object.isRequired,
  member: PropTypes.object.isRequired,
  purchases: PropTypes.array.isRequired,
  addCard: PropTypes.number.isRequired,
  logo: PropTypes.string.isRequired,
  org: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired
}

export default MemberPortal
