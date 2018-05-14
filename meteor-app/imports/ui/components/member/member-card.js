import React from 'react'
import PropTypes from 'prop-types';
import { Card, Image, Label } from 'semantic-ui-react'
import { humaniseDate } from '/imports/helpers/dates'
import './member-card.css'

const MemberCard = (props) => {
  const { _id, firstname, lastname, avatar, isHere, sessions = [], lastIn = null } = props
  const sessionsAttended = sessions.length

  return (
    <Card
      key={_id}
      href={'/' + _id}
      color={isHere ? 'green' : 'grey'}
    >
      <Image src={"/images/avatars/" + avatar} />
      <Card.Content>
        <Card.Header>
          {firstname} {lastname}
          <Card.Content>

            {
              sessionsAttended < 5 &&
              <Label>
                Newbie
                <Label.Detail>
                  {sessionsAttended}
                </Label.Detail>
              </Label>
            }
            {
              sessionsAttended > 50 &&
              <Label>
                Veteran
                <Label.Detail>
                  {sessionsAttended}
                </Label.Detail>
              </Label>
            }
          </Card.Content>
        </Card.Header>
      </Card.Content>
      <Card.Content extra>
        {
          lastIn &&
          <div>
            <p>{isHere ? 'Arrived:' : 'Last Seen'} {humaniseDate(lastIn)} ago </p>
          </div>
        }
      </Card.Content>
    </Card >
  )
}

MemberCard.propTypes = {
  _id: PropTypes.string.isRequired,
  firstname: PropTypes.string.isRequired,
  lastname: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
  isHere: PropTypes.bool.isRequired,
  sessions: PropTypes.array.isRequired,
  lastIn: PropTypes.object,
};

export default MemberCard
