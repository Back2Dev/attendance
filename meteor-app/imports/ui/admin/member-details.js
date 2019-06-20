import React from 'react'
import moment from 'moment'
import MemberCard from '/imports/ui/member-card/member-card'
import Price from '/imports/ui/shop/price'

const debug = require('debug')('b2b:admin')

const Carts = ({ carts }) => {
  return (
    <ul style={{ listStyleType: 'circle' }}>
      {carts.map(cart => (
        <li key={cart._id}>
          {moment(cart.createdAt).format('D MMM YYYY')} {cart.status}{' '}
          <Price cents={cart.price} />
          <ol type='a'>
            {cart.products.map(product => (
              <li key={product._id}>
                {product.qty} x {product.code} {product.name} ={' '}
                <Price cents={product.price} />
              </li>
            ))}
          </ol>
        </li>
      ))}
    </ul>
  )
}
const MemberDetails = ({ member, carts, sessions, purchases }) => {
  debug('MemberDetails', member)
  return (
    <div style={{ textAlign: 'left' }}>
      <MemberCard member={member} />
      Sessions ({sessions.length})
      {sessions.length === 0 ? (
        <div>(none)</div>
      ) : (
        sessions.map(session => (
          <div>
            {moment(session.createdAt).format('D MMM YYYY')} {session.name}
          </div>
        ))
      )}
      <hr />
      Purchases ({purchases.length})
      {purchases.length === 0 ? (
        <div>(none)</div>
      ) : (
        purchases.map(purchase => (
          <div>
            {moment(purchase.createdAt).format('D MMM YYYY')} {purchase.code}{' '}
            {purchase.productName} <Price cents={purchase.price} />
            &nbsp;[expires {moment(purchase.expiry).format('D MMM YYYY')}
            {'] '}
          </div>
        ))
      )}
      <hr />
      Shopping carts ({carts.length})
      {carts.length === 0 ? <div>(none)</div> : <Carts carts={carts} />}
    </div>
  )
}

export default MemberDetails
