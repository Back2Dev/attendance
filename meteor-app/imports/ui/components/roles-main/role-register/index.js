import React from 'react'
import { Link } from 'react-router-dom'
import { Card, Image, Button } from 'semantic-ui-react'

const RoleRegister = (props) => {
  if (props.loading) {
    return (
      <h1>Loading...</h1>
    )
  }

  const { _id, avatar, firstname, lastname, checkedin } = props.role
  const { recordAttendance } = props

  function updateStatus(){
    recordAttendance()
    props.history.goBack()
  }

  return (
    <Card key={_id}>
      <Image src={"/images/avatars/" + avatar} />
      <Card.Content>
        <Card.Header>
          {firstname} {lastname}
        </Card.Header>
        <Button.Group>
          <Button as={Link} to={'/roles'}>Cancel</Button>
          <Button.Or />
          <Button
            onClick={updateStatus}
            positive>
            {
              checkedin
                ? 'Sign Out'
                : 'Sign In'
            }
          </Button>
        </Button.Group>
      </Card.Content>
    </Card>
  )
}

export default RoleRegister

