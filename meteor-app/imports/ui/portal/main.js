import React from 'react'
import PropTypes from 'prop-types'
import { Button, Card, Segment, Grid, Header, Image } from 'semantic-ui-react'
import MemberCard from '/imports/ui/member/member-card'

const MemberPortal = props => {
  if (props.loading) return <div>Loading...</div>

  const goHome = () => {
    props.history.push('/kiosk')
  }

  return (
    <Segment>
      <Header as="h2">
        <Image circular src={props.logo} /> {props.org}
      </Header>
      <Grid style={{ height: '100%' }} verticalAlign="middle" divided>
        <Grid.Column width={6}>
          <Card.Group centered>
            <MemberCard className="member-visit-card" {...props.member} onCardClick={f => f} />
          </Card.Group>
        </Grid.Column>
        <Grid.Column width={10}>
          <Button type="button" size="small" onClick={() => props.toEdit()} style={{ marginTop: '24px' }}>
            Edit your profile
          </Button>
          {props.member.subsType === 'member' && props.member.status !== 'expired' && (
            <>(expires in {humaniseDate(props.member.expiry)})</>
          )}
          {props.addCard === 1 && !props.member.paymentCustId ? (
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
          ) : null}
        </Grid.Column>
      </Grid>
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
