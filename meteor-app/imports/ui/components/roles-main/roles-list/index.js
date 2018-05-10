import React from 'react'
import { Grid, Icon, Card, Image } from 'semantic-ui-react'
import RoleCard from '../role-card'
const RolesList = (props) => {
  const { roles, title, cardsPerRow } = props
  return (
    //renders list of users signed in OR out
    <div>
      <h1>{title}</h1>
      <Card.Group itemsPerRow={cardsPerRow}>
        {
          roles.map(role => (
            <RoleCard key={role._id} {...role} />
          ))
        }
      </Card.Group>
    </div>
  )
}

export default RolesList