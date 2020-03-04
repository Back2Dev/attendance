import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Button, Card, Segment, Grid, Header, Image } from 'semantic-ui-react'
import MemberCard from '/imports/ui/member/member-card'

const MemberPortal = props => {
  if (props.loading) return <div>Loading...</div>

  const goHome = () => {
    props.history.push('/kiosk')
  }
  return (
    <Segment>
      <Header as="h2" style={{ textAlign: 'center' }}>
        <Image circular src={props.logo} /> {props.org}
      </Header>
      <Grid.Column width={6}>
        <Card.Group centered>
          <MemberCard className="member-visit-card" {...props.member} onCardClick={f => f} />
        </Card.Group>
      </Grid.Column>
      <Grid.Column width={10}>
        {props.member.subsType === 'member' && props.member.status !== 'expired' && (
          <>(expires in {humaniseDate(props.member.expiry)})</>
        )}
        <Button type="button" size="small" onClick={() => props.toEdit()} style={{ height: '50px' }}>
          Edit your profile
        </Button>
        {props.addCard === 1 && !props.member.paymentCustId ? (
          <Button
            type="button"
            size="small"
            color="green"
            onClick={() => props.history.push(`/shop/register-card/${props.member._id}`)}
            style={{ height: '50px' }}
          >
            <Image className="card-mc" src={'/images/visa-mc.jpg'} verticalAlign="middle" />
            Register your credit card
          </Button>
        ) : null}
        <Button
          style={{ height: '50px' }}
          color="red"
          floated="right"
          onClick={() => props.history.push(`/shop/renew/${props.member._id}/${props.cart._id}`)}
        >
          Pay Now
        </Button>
      </Grid.Column>
      <Card fluid>
        <Card.Content header="Member Details" />
        <Card.Content>
          Name: {props.member.name} <br />
          Address: {`${props.member.addressStreet} ${props.member.addressSuburb} ${props.member.addressPostcode}`}{' '}
          <br />
          Email: {props.member.email} <br />
          Subscription Type: {props.member.subsType || 'Invalid'} <br />
        </Card.Content>
      </Card>
      <Card fluid>
        <Card.Content header={`Sessions (${props.sessions.length})`} />
        <Card.Content>
          {props.sessions.length === 0 ? (
            <div>(none)</div>
          ) : (
            props.sessions.map((session, ix) => (
              <div key={`s${ix}`}>
                {moment(session.createdAt).format('D MMM YYYY')} - {session.name}
              </div>
            ))
          )}
        </Card.Content>
      </Card>
      <Card fluid>
        <Card.Content header={`Purchases (${props.purchases.length})`} />
        <Card.Content>
          {props.purchases.length === 0 ? (
            <div>(None)</div>
          ) : (
            props.purchases.map((purchase, ix) => (
              <div key={`s${ix}`}>
                {purchase.productName} - Status: {purchase.paymentStatus}
              </div>
            ))
          )}
        </Card.Content>
      </Card>
      <Card fluid>
        <Card.Content header={`Carts (${props.carts.length})`} />
        <Card.Content>
          {props.carts.length === 0 ? (
            <div>(None)</div>
          ) : (
            props.carts.map((cart, ix) => <div key={`s${ix}`}>{moment(cart.createdAt).format('D MMM YYYY')}</div>)
          )}
        </Card.Content>
      </Card>
    </Segment>
  )
}

MemberPortal.propTypes = {
  member: PropTypes.object.isRequired,
  addCard: PropTypes.number.isRequired,
  logo: PropTypes.string.isRequired,
  org: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired
}

export default MemberPortal
