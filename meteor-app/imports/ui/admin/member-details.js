import React from 'react'
import moment from 'moment'
import { Checkbox, Header, Button } from 'semantic-ui-react'
import MemberCard from '/imports/ui/member-card/member-card'
import Price from '/imports/ui/shop/price'
import CartList from './cart-list'
import Alert from '/imports/ui/utils/alert'

const debug = require('debug')('b2b:admin')

const MemberDetails = ({
  member,
  carts,
  sessions,
  purchases,
  forgetCard,
  updateAutoPay,
  history,
  migrateSessions,
  addPaymentEmail
}) => {
  const [autoPay, setAutoPay] = React.useState(member.autoPay)
  const toggleAutoPay = e => {
    setAutoPay(!autoPay)
    updateAutoPay(member._id, !autoPay)
  }
  const forgetCC = () => {
    forgetCard(member._id)
  }
  const addProduct = (memberId, name) => {
    sessionStorage.removeItem('mycart')
    sessionStorage.setItem('memberId', memberId)
    sessionStorage.setItem('name', name)
    history.push('/shop')
  }

  debug('MemberDetails', member)
  return (
    <div style={{ textAlign: 'left' }}>
      <MemberCard member={member} />
      <hr></hr>
      {!member.paymentCustId && <span>No credit card on file</span>}
      {member.paymentCustId && (
        <>
          &nbsp;
          <Button color="red" inverted onClick={forgetCC}>
            Forget credit card
          </Button>
          <Checkbox label="Auto Pay" defaultChecked={member.autoPay} onChange={toggleAutoPay}></Checkbox>
        </>
      )}
      &nbsp;
      <Button
        color="blue"
        onClick={e => {
          e.preventDefault()
          addProduct(member._id, member.name)
        }}
        content="Add..."
        about={member.name}
      />
      <Button
        color="red"
        onClick={e => {
          e.preventDefault()
          migrateSessions(member._id)
          Alert.success(`All sessions have been migrated`)
        }}
        content="Merge"
      />
      &nbsp;
      <a href={`/edit/${member._id}`} target="_blank">
        <Button color="purple">Edit...</Button>
      </a>
      &nbsp;
      <Button
        color="cyan"
        type="button"
        onClick={e => {
          e.preventDefault()
          const email = prompt('Please enter email to add')
          if (email) {
            addPaymentEmail(member._id, email)
          }
        }}
        content="Add billing email"
      />
      &nbsp;
      <span>
        Billing emails: {member.paymentEmails && member.paymentEmails.map((email, ix) => <span key={ix}>{email}</span>)}
      </span>
      <hr></hr>
      Sessions (<span id="numSessions">{sessions.length}</span>)
      {sessions.length === 0 ? (
        <div>(none)</div>
      ) : (
        sessions.map((session, ix) => (
          <div key={`s${ix}`}>
            {moment(session.timeIn).format('D MMM YYYY')} {session.name}
          </div>
        ))
      )}
      <hr />
      Purchases (<span id="numPurchases">{purchases.length}</span>)
      {purchases.length === 0 ? (
        <div>(none)</div>
      ) : (
        purchases.map((purchase, ix) => (
          <div key={`p${ix}`}>
            {moment(purchase.createdAt).format('D MMM YYYY')} {purchase.code} {purchase.productName}&nbsp;
            {purchase.paymentMethod} &nbsp;
            <Price cents={purchase.price} />
            &nbsp;[expires {moment(purchase.expiry).format('D MMM YYYY')}
            {'] '}
            {purchase.remaining >= 0 && `${purchase.remaining} remaining`}
          </div>
        ))
      )}
      <hr />
      <Header as="h5">
        Shopping carts (<span id="numCarts">{carts.length}</span>)
      </Header>
      {carts.length === 0 ? <div>(none)</div> : <CartList carts={carts} removeCart={() => {}} />}
    </div>
  )
}

export default MemberDetails
