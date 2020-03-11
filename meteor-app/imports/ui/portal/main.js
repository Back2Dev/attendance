import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import GoHome from '/imports/ui/components/go-home-button'
import { Button, Card, Segment, Grid, Header, Image, Container, Icon, Table } from 'semantic-ui-react'
import MembershipCard from '/imports/ui/member-card/member-card'
import MultiVisitsCard from '/imports/ui/punch-card/multi-visits-card'
import MemberVisitsCard from '/imports/ui/punch-card/member-visits-card'
import { startOfDay } from 'date-fns'

const MemberPortal = props => {
  if (props.loading) return <div>Loading...</div>
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
          {props.member.subsType === 'member' && props.purchase && <MemberVisitsCard memberDuration={12} />}
        </Card.Group>
      </Grid.Column>
      <Button type="button" onClick={() => props.toEdit()} style={{ height: '50px' }}>
        Edit your profile
      </Button>
      <GoHome />
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
      <Card fluid>
        <Card.Content header={`Purchases (${props.purchases.length})`} />
        <Card.Content>
          <Card.Description>
            <Table basic="very" celled>
              <Table.Body>
                {props.purchases.length === 0 ? (
                  <div>(None)</div>
                ) : (
                  props.purchases.map((purchase, ix) => (
                    <Table.Row negative={purchase.paymentStatus === 'unpaid'} key={`s${ix}`}>
                      <Table.Cell>{purchase.productName}</Table.Cell>
                      <Table.Cell>{'$' + purchase.price / 100}</Table.Cell>
                      <Table.Cell>{moment(purchase.createdAt).format('D MMM YYYY')}</Table.Cell>
                      <Table.Cell>
                        {purchase.paymentStatus === 'unpaid' ? (
                          <b>{purchase.paymentStatus.toUpperCase()}</b>
                        ) : (
                          purchase.paymentStatus
                        )}
                      </Table.Cell>
                    </Table.Row>
                  ))
                )}{' '}
              </Table.Body>
            </Table>
          </Card.Description>
        </Card.Content>
      </Card>
      <Card fluid>
        <Card.Content header={`Sessions (${props.sessions.length})`} />
        <Card.Content>
          <Table basic="very" celled>
            <Table.Body>
              {props.sessions.length === 0 ? (
                <div>(none)</div>
              ) : (
                props.sessions.map((session, ix) => (
                  <Table.Row key={`s${ix}`}>
                    <Table.Cell>{session.name}</Table.Cell>
                    <Table.Cell>{moment(session.createdAt).format('D MMM YYYY')}</Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table>
        </Card.Content>
      </Card>
      {props.member.subsType === 'pass' &&
        props.purchases.map(purchase => (
          <MultiVisitsCard
            style={{ marginLeft: 0 }}
            usedVisits={purchase.sessions.length}
            totalVisits={purchase.sessions.length + purchase.remaining}
          />
        ))}
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
