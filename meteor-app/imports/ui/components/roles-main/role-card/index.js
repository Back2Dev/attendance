import React from 'react'
import { Grid, Icon, Card, Image } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import './style.css'

const RoleCard = (props) => {
  const { _id, firstname, lastname, avatar, isHere } = props
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
          </Card.Header>
        </Card.Content>
      </Card>
  )
}

export default RoleCard

