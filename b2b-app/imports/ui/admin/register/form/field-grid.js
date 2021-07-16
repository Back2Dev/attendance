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
  children: PropTypes.node.isRequired,
  /* the number of columns for the grid container */
  cols: PropTypes.number,
  /* the number of columns for the item */
  span: PropTypes.number,
  container: PropTypes.bool,
  item: PropTypes.bool,
}

FieldGrid.defaultValues = {
  cols: 1,
  span: 1,
}

export default FieldGrid
