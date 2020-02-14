import React from 'react'
import { Header, Button } from 'semantic-ui-react'
import MultiVisitsCard from '/imports/ui/punch-card/multi-visits-card'

const SignOut = props => {
  return (
    <div>
      <Header as="h4">See you next time!</Header>
      <div style={{ textAlign: 'center' }}>Member Type: {props.member.subsType}</div>
      {props.member.subsType === 'pass' && props.purchase && props.purchase.sessions.length && (
        <MultiVisitsCard
          usedVisits={props.purchase.sessions.length}
          totalVisits={props.purchase.sessions.length + props.purchase.remaining}
        />
      )}
      &nbsp;
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        {props.purchase && props.purchase.paymentStatus === 'unpaid' && (
          <Button color="red" onClick={() => props.history.push(`/shop/renew/${props.member._id}/${props.cart._id}`)}>
            Pay Now
          </Button>
        )}
        <Button onClick={() => props.recordDeparture()} positive fluid id="signIn">
          Sign Out
        </Button>
      </div>
    </div>
  )
}

export default SignOut
