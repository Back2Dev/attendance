import React from 'react'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import makeStyles from '@mui/styles/makeStyles';
import PropTypes from 'prop-types'

const useStyles = makeStyles(() => ({
  container: {
    position: 'relative',
    '&:hover $deleteButton': {
      display: 'block',
    },
  },
  image: {
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    display: 'block',
    width: '200px',
  },
  deleteButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    zIndex: 10,
    background: 'white',
    padding: '1px',
    display: 'none',
    '&:hover': {
      background: 'gray',
    },
  },
}))

const FieldImage = ({ src, onDeleteImage }) => {
  const classes = useStyles()

  return (
    <div className={classes.container}>
      <img src={src} loading="lazy" className={classes.image} />

      <IconButton
        aria-label="delete"
        color="secondary"
        size="small"
        className={classes.deleteButton}
        onClick={onDeleteImage}
      >
        <DeleteIcon />
      </IconButton>
    </div>
  )
}

FieldImage.propTypes = {
  /** image path for the question/answer */
  src: PropTypes.string,
  /** function gets called when delete button is clicked*/
  onDeleteImage: PropTypes.string,
}

FieldImage.defaultProps = {
  initialList: [''],
}

export { FieldImage }
