import React, { useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'

import { RegisterContext } from '../context'

const useStyles = makeStyles((theme) => ({
  root: {
    display: ({ isMobile }) => (isMobile ? 'block' : 'grid'),
    gridTemplateColumns: ({ cols }) => `repeat(${cols}, 1fr)`,
    columnGap: theme.spacing(2),
  },
}))

/**
 * A grid layout component for form input fields
 */
const FieldGrid = ({ cols, container, item, span, children }) => {
  const { isMobile } = useContext(RegisterContext)
  const classes = useStyles({ cols, isMobile })

  if (container) {
    return <div className={classes.root}>{children}</div>
  } else if (item) {
    return <div style={{ gridColumnEnd: `span ${span}` }}>{children}</div>
  } else {
    throw new Error('FieldGrid must have a container or item prop')
  }
}

FieldGrid.propTypes = {
  /** FieldGrid items */
  children: PropTypes.node.isRequired,
  /** the number of columns for the grid container */
  cols: PropTypes.number,
  /** the number of columns for the item */
  span: PropTypes.number,
  /** set the component as a container */
  container: PropTypes.bool,
  /** set the component as an item */
  item: PropTypes.bool,
}

FieldGrid.defaultProps = {
  cols: 1,
  span: 1,
}

export default FieldGrid
