import React from 'react'
import { Header, Button } from 'semantic-ui-react'
import MultiVisitsCard from '/imports/ui/punch-card/multi-visits-card'

const SignOut = props => {
  return (
    <div>
      <Header as="h4">See you next time!</Header>
      {props.member.subsType === 'pass' && (
        <MultiVisitsCard
          usedVisits={props.purchase.sessions.length}
          totalVisits={props.purchase.sessions.length + props.purchase.remaining}
        />
      )}
      &nbsp;
      <Button onClick={() => props.recordDeparture()} positive fluid id="signIn" size="large">
        Sign Out
      </Button>
    </div>
  )
}

export default SignOut
