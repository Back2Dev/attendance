import React from 'react'
import PropTypes from 'prop-types'

const PurchaseList = ({ purchases, removePurchase }) => {
  const purchase = purchases[purchases.length - 1]
  return (
    <ul style={{ listStyleType: 'circle' }}>
      <span key={purchase._id}>
        <li key={purchase._id}>
          {purchase.productName} <Price cents={purchase.price} />
        </li>
        <li>Expires: {moment(purchase.expiry).format('D MMM YYYY')}</li>
      </span>
    </ul>
  )
}

PurchaseList.propTypes = {
  // removePurchase: PropTypes.func.isRequired
  purchases: PropTypes.array.isRequired
}

export default PurchaseList
