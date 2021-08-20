import React from 'react'
import PropTypes from 'prop-types'

const Section = ({ heading, children }) => {
  return (
    <div>
      <h2>{heading}</h2>
      {children}
    </div>
  )
}

Section.propTypes = {
  /** section title for a field group */
  heading: PropTypes.string,
  children: PropTypes.node,
}

export default Section
