import React from 'react'
import PropTypes from 'prop-types'
import { Button } from 'semantic-ui-react'

import '/imports/lib/pinpayment_button'

const CreditCardButton = ({ image, url }) => {
  return (
    <a className="pin-payment-button" href={url} id="pay-by-card">
      {image && <img src="/images/pay-button.png" alt="Pay Now" width="86" height="38" />}
      {!image && <Button color="green" inverted content="Pay by credit card..." icon="credit card" />}
    </a>
  )
}

CreditCardButton.propTypes = {
  image: PropTypes.string,
  url: PropTypes.string.isRequired
}

export default CreditCardButton
