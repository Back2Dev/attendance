import React from 'react'
import PropTypes from 'prop-types'

export default (Price = props => {
  return <span>${props.cents / 100}</span>
})

Price.propTypes = {
  cents: PropTypes.number.isRequired
}
