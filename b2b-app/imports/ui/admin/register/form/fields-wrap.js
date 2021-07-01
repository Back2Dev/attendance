import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'grid',
    gridTemplateColumns: ({ cols }) => `repeat(${cols}, 1fr)`,
    columnGap: theme.spacing(2),
  },
}))

const FieldsWrap = ({ cols, children }) => {
  const classes = useStyles({ cols })
  return <div className={classes.root}>{children}</div>
}

FieldsWrap.propTypes = {
  children: PropTypes.node.isRequired,
  cols: PropTypes.number.isRequired,
}

export default FieldsWrap
