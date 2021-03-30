import React from 'react'
import PropTypes from 'prop-types'

export const Address = ({ fields, card }) => (
  <div>
    {fields
      .filter(part => card[`address_${part}`])
      .map(part => (
        <span key={part}>
          {card[`address_${part}`]}
          <br />
        </span>
      ))}
  </div>
)

Address.propTypes = {
  fields: PropTypes.array.isRequired,
  card: PropTypes.object.isRequired
}
