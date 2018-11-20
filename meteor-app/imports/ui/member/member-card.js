import React from 'react'
import PropTypes from 'prop-types';
import { Card, Icon, Image, Label } from 'semantic-ui-react'
import { humaniseDate } from '/imports/helpers/dates'
import '/imports/ui/member/member-card.css'

const MemberCard = (props) => {
  const { _id, name, avatar, isSuper, isHere, sessionCount, sessions = [], lastIn = null } = props
  const newbie = sessionCount <= 5

  return (
    <Card
      style={{ textAlign: 'center' }}
      className={props.className}
      key={_id}
    >
      <Image
        src={"/images/avatars/" + avatar}
        label={isSuper ? { color: 'yellow', icon: 'star', ribbon: true } : null}
      />
      <Card.Content>
        <Card.Header >
          {name}
        </Card.Header>
        <Card.Content>
          <div style={{
            padding: '10px 0',
          }}>
            <Label color={newbie ? 'green' : isSuper ? 'yellow' : 'blue'}>
              <Icon name='trophy' />
              {sessionCount}
            </Label>
            {
              newbie &&
              <Label color='green'>
                Newbie
              </Label>
            }
          </div>
          <div>
            {props.children}
          </div>

        </Card.Content>
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
  className: PropTypes.string,
  _id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
  isHere: PropTypes.bool.isRequired,
  sessions: PropTypes.array.isRequired,
  lastIn: PropTypes.object,
  sessionCount: PropTypes.number.isRequired,
};

export default MemberCard