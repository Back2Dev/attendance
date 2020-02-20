import React from 'react'
import PropTypes from 'prop-types'
import { Button, Icon } from 'semantic-ui-react'

const MemberEditControl = props => {
  return (
    <div style={{ marginTop: '50px', textAlign: 'center' }}>
      <Button.Group>
        <Button onClick={props.reviewStep}>Back</Button>
        <Button positive type="submit" floated="right">
          Update
        </Button>
      </Button.Group>
    </div>
  )
}

MemberEditControl.propTypes = {
  step: PropTypes.number.isRequired,
  backStep: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  totalSteps: PropTypes.number.isRequired
}

export default MemberEditControl
