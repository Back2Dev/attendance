import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import GoHome from '/imports/ui/components/go-home-button'
import { Button, Card, Segment, Grid, Header, Image, Container, Icon } from 'semantic-ui-react'
import MembershipCard from '/imports/ui/member-card/member-card'
import MultiVisitsCard from '/imports/ui/punch-card/multi-visits-card'
import MemberVisitsCard from '/imports/ui/punch-card/member-visits-card'

const MemberPortal = props => {
  if (props.loading) return <div>Loading...</div>
  if (props.member && !props.member._id) return <div>You are not logged in</div>
  const cards = {}
  if (props.member.subsType === 'member') {
    props.sessions.forEach(session => {
      const y = moment(session.timeIn).year()
      const m = moment(session.timeIn).month()
      if (!cards[y]) {
        cards[y] = { months: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }
      }
      cards[y].months[m] += 1
    })
  }
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
          props.member.subsType === 'pass' &&
          props.purchases.map((purchase, ix) => (
            <MultiVisitsCard
              key={ix}
              usedVisits={purchase.sessions.length}
              totalVisits={purchase.sessions.length + purchase.remaining}
              paid={purchase.paymentStatus === 'paid'}
            />
          ))}
        {props.sessions &&
          props.member.subsType === 'member' &&
          Object.keys(cards).map((year, ix) => {
            return <MemberVisitsCard key={ix} months={cards[year].months} title={`Visits ${year}`} />
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
