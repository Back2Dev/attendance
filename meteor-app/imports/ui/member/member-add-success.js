import React from 'react'
import PropTypes from 'prop-types';
import { Card, Grid, Header, Message } from 'semantic-ui-react'
import MemberCard from '/imports/ui/member/member-card'

const MemberAddSuccess = (props) => {

  return (
    <Grid centered style={{ height: '100%' }} verticalAlign='middle' textAlign='center' >
      <Grid.Column>
        <Message>
          <Message.Header>
            You were successfully added to our Volunteer List.
        </Message.Header>
          <p>When you first visit, say hello to someone on the team.
          They'll help you find your avatar on the attendance app, where you can sign in.</p>
          <p>Your avatar card will look like this:</p>
        </Message>
        <Card.Group centered>
          <MemberCard
            {...props.member}
            onCardClick={f => f}
          />
        </Card.Group>
      </Grid.Column>
    </Grid>
  )
}

MemberAddSuccess.propTypes = {
};

export default MemberAddSuccess