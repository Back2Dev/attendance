import React from 'react'
import { Header, Button } from 'semantic-ui-react'

const SignOut = props => {
  return (
    <div>
      <Header as="h4">See you next time!</Header>
      <Button onClick={() => props.recordDeparture()} positive fluid id="signIn" size="large">
        Sign Out
      </Button>
    </div>
  )
}

export default SignOut
