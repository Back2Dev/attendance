import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'

const Section = ({ heading, children }) => {
  return (
    <div>
      <Typography style={{ marginTop: '10px' }} variant="body1">
        {heading}
      </Typography>

      {children}
    </div>
  )
}

Section.propTypes = {
  /** section title for a field group */
  heading: PropTypes.string,
  children: PropTypes.node,
}

export { Section }
