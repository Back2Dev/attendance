import React from 'react'
import { Grid, Icon, Card, Image, Label } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { humaniseDate } from '/imports/helpers/dates'
import './style.css'

const RoleCard = (props) => {
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
              {isHere ? 'Arrived:' : 'Last Seen'} {humaniseDate(lastIn)} ago 
            </div>
    }
      </Card.Content>
    </Card >
  )
}

export default RoleCard

