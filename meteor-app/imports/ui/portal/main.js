import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Button, Card, Segment, Grid, Header, Image, Table, Icon } from 'semantic-ui-react'
import MembershipCard from '/imports/ui/member-card/member-card'
import MultiVisitsCard from '/imports/ui/punch-card/multi-visits-card'
import MemberVisitsCard from '/imports/ui/punch-card/member-visits-card'

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
          {props.member.subsType === 'member' && props.purchase && <MemberVisitsCard memberDuration={12} />}
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
          floated="right"
          onClick={() => props.history.push(`/shop/renew/${props.member._id}/${props.cart._id}`)}
        >
          Pay Now
        </Button>
      )}
      <div style={{ display: 'flex', padding: '20px' }}>
        {props.member.subsType === 'pass' &&
          props.purchases.map(purchase => (
            <MultiVisitsCard
              style={{ marginLeft: 0 }}
              usedVisits={purchase.sessions.length}
              totalVisits={purchase.sessions.length + purchase.remaining}
            />
          ))}
      </div>
    </Segment>
  )
}

MemberPortal.propTypes = {
  member: PropTypes.object.isRequired,
  purchase: PropTypes.object.isRequired,
  purchases: PropTypes.array.isRequired,
  addCard: PropTypes.number.isRequired,
  logo: PropTypes.string.isRequired,
  org: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired
}

export default MemberPortal
