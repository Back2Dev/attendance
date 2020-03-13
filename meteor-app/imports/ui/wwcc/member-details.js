import React from 'react'
import moment from 'moment'
import { Segment, Header } from 'semantic-ui-react'
import MemberCard from '/imports/ui/member-card/member-card'
import Price from '/imports/ui/shop/price'

const debug = require('debug')('b2b:admin')

const MemberDetails = ({ member }) => {
  debug('MemberDetails', member)
  return (
    <div style={{ textAlign: 'left' }}>
      <MemberCard member={member} />
      <hr />
    </div>
  )
}

export default MemberDetails
