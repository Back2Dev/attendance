import React from 'react'
import PropTypes from 'prop-types'
import { Button, Card, Segment, Grid, Header, Image } from 'semantic-ui-react'
import MemberCard from '/imports/ui/member/member-card'
import { VisitContextProvider } from './context'

const MemberPortal = props => {
  if (props.loading) return <div>Loading...</div>

  const goHome = () => {
    props.history.push('/kiosk')
  }

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
              <Image circular src={props.logo} /> Members Portal
            </Header>
            <Button onClick={goHome}>Home</Button>
          </VisitContextProvider>
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
