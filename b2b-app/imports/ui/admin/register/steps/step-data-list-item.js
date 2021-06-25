import React from 'react'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
import { makeStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'

const useStyles = makeStyles((theme) => ({
  avatar: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
}))

const StepDataListItem = ({ label, value, isAvatar }) => {
  const classes = useStyles()

  return (
    <div>
      <ListItem disableGutters disabled={value === null}>
        {isAvatar ? (
          <ListItemAvatar>
            <Avatar
              src={`/images/avatars/${value}`}
              alt={value}
              className={classes.avatar}
            />
          </ListItemAvatar>
        ) : (
          <ListItemText primary={value !== null ? value : 'BLANK'} secondary={label} />
        )}
      </ListItem>
    </div>
  )
}

StepDataListItem.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isAvatar: PropTypes.bool,
}

export default StepDataListItem
