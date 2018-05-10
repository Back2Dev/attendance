import React from 'react'
import PropTypes from 'prop-types'
import Avatar from './avatar'
import { Button, Segment, Loader } from 'semantic-ui-react'

const ConfirmCheckin = (props) => {

  if (props.loading) {return <Loader active inline='centered'/>}

  const { id, name, surname, avatar } = props.person
  const isCheckedin = props.isCheckedin

  return (
    <Segment style={{ marginTop: '7em' }}>
        <Avatar
          _id={id}
          firstName={name}
          lastName={surname}
          isCheckedin={isCheckedin}
          fileName={avatar}
        />    
        <Button.Group>
          <Button onClick={ () => props.cancel() }>
            Cancel
          </Button>
          <Button.Or />
          <Button positive
            onClick={ () => props.checkin(id) }> 
            Check In
          </Button>
        </Button.Group>      
    </Segment>
  ) 

}

ConfirmCheckin.Proptypes = {
  person: PropTypes.object.isRequired,
  isCheckedin: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  cancel: PropTypes.func.isRequired,
  checkin: PropTypes.func.isRequired,
}

export default ConfirmCheckin;

