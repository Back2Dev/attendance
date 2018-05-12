import React from 'react'
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'
import { Card, Image, Button } from 'semantic-ui-react'

const RoleRegister = (props) => {
  if (props.loading) {
    return (
      <h1>Loading...</h1>
    )
  }

  const { _id, avatar, firstname, lastname, isHere } = props.role
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
          <Button as={Link} to={'/'}>Cancel</Button>
          <Button.Or />
          <Button
            onClick={updateStatus}
            positive>
            {
              isHere
                ? 'Sign Out'
                : 'Sign In'
            }
          </Button>
        </Button.Group>
      </Card.Content>
    </Card>
  )
}

RoleRegister.propTypes = {
  _id: PropTypes.string.isRequired,
  firstname: PropTypes.string.isRequired,
  lastname: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
  isHere: PropTypes.bool.isRequired,
  sessions: PropTypes.array.isRequired,
  lastIn: PropTypes.object,
  recordAttendance: PropTypes.func.isRequired,
};

export default RoleRegister

