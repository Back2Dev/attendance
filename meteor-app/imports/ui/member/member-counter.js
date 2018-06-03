import React from 'react'
import { Label, Icon } from 'semantic-ui-react'

const MemberCounter = (props) => {
  return (
    <div style={{
      marginBottom: '20px',
    }}>
      <Label color='green' size='huge'>
        <Icon name='user' /> {props.count}
      </Label>
    </div>
  )
}

export default MemberCounter