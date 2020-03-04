import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Button, Card, Segment, Grid, Header, Image, Table } from 'semantic-ui-react'
import MemberCard from '/imports/ui/member/member-card'
import MultiVisitsCard from '/imports/ui/punch-card/multi-visits-card'

const MemberPortal = props => {
  if (props.loading) return <div>Loading...</div>

  return (
    <Segment>
      <Header as="h2" style={{ textAlign: 'center' }}>
        <Image circular src={props.logo} /> {props.org}
      </Header>
      <Grid.Column width={6}>
        <Card.Group>
          <MemberCard className="member-visit-card" {...props.member} onCardClick={f => f} />
          {props.member.subsType === 'pass' && props.purchase && (
            <MultiVisitsCard
              style={{ marginLeft: 0 }}
              usedVisits={props.purchase.sessions.length}
              totalVisits={props.purchase.sessions.length + props.purchase.remaining}
            />
          )}
        </Card.Group>
      </Grid.Column>
      <Grid.Column width={10}>
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
      </Grid.Column>
      <Card fluid>
        <Card.Content header="Member Details" />
        <Card.Content>
          <Table definition>
            <Table.Body>
              <Table.Row>
                <Table.Cell width={2}>Name</Table.Cell>
                <Table.Cell>{props.member.name}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Adress</Table.Cell>
                <Table.Cell>{`${props.member.addressStreet} ${props.member.addressSuburb} ${props.member.addressPostcode}`}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Email</Table.Cell>
                <Table.Cell>{props.member.email}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Subscription</Table.Cell>
                <Table.Cell>{props.member.subsType || 'Invalid'}</Table.Cell>
              </Table.Row>
              {props.member.subsType === 'member' && props.member.status !== 'expired' && (
                <Table.Row>
                  <Table.Cell>Expiry</Table.Cell>{' '}
                  <Table.Cell>{moment(props.member.expiry).format('DD/MM/YY')}</Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
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
                  <Table.Row>
                    <Table.Cell>{session.name}</Table.Cell>
                    <Table.Cell>{moment(session.createdAt).format('D MMM YYYY')}</Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table>
          {/* {props.sessions.length === 0 ? (
            <div>(none)</div>
          ) : (
            props.sessions.map((session, ix) => (
              <div key={`s${ix}`}>
                {moment(session.createdAt).format('D MMM YYYY')} - {session.name}
              </div>
            ))
          )} */}
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
