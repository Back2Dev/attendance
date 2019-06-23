import React from 'react'
import PropTypes from 'prop-types'

const PurchaseList = ({ purchases, removePurchase }) => {
  return (
    <ul style={{ listStyleType: 'circle' }}>
      {purchases.map((purchase, ix) => (
        <span key={purchase._id}>
          <li key={purchase._id}>
            {purchase.productName} <Price cents={purchase.price} />
          </li>
          <li key={ix}>Expires: {moment(purchase.expiry).format('D MMM YYYY')}</li>
        </span>
      ))}
    </ul>
  )
}

PurchaseList.propTypes = {
  // removePurchase: PropTypes.func.isRequired
  purchases: PropTypes.array.isRequired
}

export default PurchaseList
