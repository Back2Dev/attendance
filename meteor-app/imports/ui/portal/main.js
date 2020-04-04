import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import GoHome from '/imports/ui/components/go-home-button'
import { Button, Card, Segment, Grid, Header, Image, Container, Icon } from 'semantic-ui-react'
import MembershipCard from '/imports/ui/member-card/member-card'
import MultiVisitsCard from '/imports/ui/punch-card/multi-visits-card'
import MemberVisitsCard from '/imports/ui/punch-card/member-visits-card'

const MemberPortal = ({ loading, member, sessions, addCard, history, org, logo, purchases, cart }) => {
  if (loading) return <div>Loading...</div>
  if (member && !member._id) return <div>You are not logged in</div>
  const cards = {}
  if (member.subsType === 'member') {
    sessions.forEach(session => {
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
        <Image circular src={logo} /> {org}
      </Header>
      <Grid.Column width={6}>
        <Card.Group style={{ paddingBottom: '20px' }}>
          <MembershipCard className="member-visit-card" member={member} />)
        </Card.Group>
      </Grid.Column>
      {addCard === 1 && !member.paymentCustId ? (
        <Button
          type="button"
          color="green"
          onClick={() => history.push(`/shop/register-card/${member._id}`)}
          style={{ height: '50px' }}
        >
          <Icon name="credit card" />
          Register your credit card
        </Button>
      ) : null}
      {cart && (
        <Button
          style={{ height: '50px' }}
          color="red"
          onClick={() => history.push(`/shop/renew/${member._id}/${cart._id}`)}
        >
          Pay Now
        </Button>
      )}
      <Container style={{ display: 'flex', flexWrap: 'wrap' }}>
        {purchases &&
          member.subsType === 'pass' &&
          purchases.map((purchase, ix) => (
            <MultiVisitsCard
              key={ix}
              usedVisits={purchase.sessions.length}
              totalVisits={purchase.sessions.length + purchase.remaining}
              paid={purchase.paymentStatus === 'paid'}
            />
          ))}
        {sessions &&
          member.subsType === 'member' &&
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
