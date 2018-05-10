import React from 'react'
import { Grid, Icon, Card, Image } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
const RoleCard = (props) => {
  const { _id, firstname, lastname, avatar } = props
  return (
    <Link to={'/' + _id}>
      <Card key={_id}>
        <Image src={"/images/avatars/" + avatar} />
        <Card.Content>
          <Card.Header>
            {firstname} {lastname}
          </Card.Header>
        </Card.Content>
      </Card>
    </Link>
  )
}

export default RoleCard

