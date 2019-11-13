import React from 'react'
import moment from 'moment'
import { Checkbox, Header, Button } from 'semantic-ui-react'
import MemberCard from '/imports/ui/member-card/member-card'
import Price from '/imports/ui/shop/price'
import CartList from './cart-list'

const debug = require('debug')('b2b:admin')

const MemberDetails = ({ member, carts, sessions, purchases, forgetCard }) => {
  debug('MemberDetails', member)
  return (
    <div style={{ textAlign: 'left' }}>
      <MemberCard member={member} />
      <hr></hr>
      <Button>Forget credit card</Button>
      <Checkbox label="Auto Pay" defaultChecked={member.autoPay} onChange={toggleAutoPay}></Checkbox>
      <hr></hr>
      Sessions ({sessions.length})
      {sessions.length === 0 ? (
        <div>(none)</div>
      ) : (
        sessions.map((session, ix) => (
          <div key={`s${ix}`}>
            {moment(session.createdAt).format('D MMM YYYY')} {session.name}
          </div>
        ))
      )}
      <hr />
      Purchases ({purchases.length})
      {purchases.length === 0 ? (
        <div>(none)</div>
      ) : (
        purchases.map((purchase, ix) => (
          <div key={`p${ix}`}>
            {moment(purchase.createdAt).format('D MMM YYYY')} {purchase.code} {purchase.productName}{' '}
            <Price cents={purchase.price} />
            &nbsp;[expires {moment(purchase.expiry).format('D MMM YYYY')}
            {'] '}
          </div>
        ))
      )}
      <hr />
      <Header as="h5">Shopping carts ({carts.length})</Header>
      {carts.length === 0 ? <div>(none)</div> : <CartList carts={carts} removeCart={() => {}} />}
    </div>
  )
}

export default MemberDetails
