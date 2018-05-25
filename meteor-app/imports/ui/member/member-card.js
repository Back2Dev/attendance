import React from 'react'
import PropTypes from 'prop-types';
import { Card, Icon, Image, Label } from 'semantic-ui-react'
import { humaniseDate } from '/imports/helpers/dates'
import '/imports/ui/member/member-card.css'

const MemberCard = (props) => {
  const { _id, name, avatar, isHere, sessions = [], lastIn = null } = props
  const sessionsNum = sessions.length

  const newbie = sessionsNum <= 5

  return (
    <Card
      key={_id}
      onClick={() => props.onCardClick(_id)}
    >
      <Image src={"/images/avatars/" + avatar} />
      <Card.Content>
        <Card.Header>
          {name}
          <Card.Content>

            {
              newbie &&
              <div>
                <Label color='green'>
                  <Icon name='star' />
                  {sessionsNum}
                </Label>
                <Label color='green'>
                  Newbie
              </Label>
              </div>
            }

            {React.Children.map(props.children, (child) => child)}

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
  name: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
  isHere: PropTypes.bool.isRequired,
  sessions: PropTypes.array.isRequired,
  lastIn: PropTypes.object,
  onCardClick: PropTypes.func.isRequired,
};

export default MemberCard
