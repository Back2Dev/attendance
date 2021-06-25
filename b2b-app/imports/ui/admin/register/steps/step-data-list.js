import React from 'react'
import List from '@material-ui/core/List'
import ListSubheader from '@material-ui/core/ListSubheader'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import EditIcon from '@material-ui/icons/Edit'
import { makeStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'

import StepDataListItem from './step-data-list-item'

const useStyles = makeStyles((theme) => ({
  listSubheader: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  list: {
    marginBottom: theme.spacing(4),
  },
  button: {
    margin: theme.spacing(1),
  },
}))

const StepDataList = ({ title, onEdit, model }) => {
  const classes = useStyles()
  return (
    <List
      dense
      disablePadding
      subheader={
        <ListSubheader
          disableGutters
          className={classes.listSubheader}
          color="primary"
          disableSticky
        >
          <div>{title}</div>
          <Button
            color="default"
            className={classes.button}
            startIcon={<EditIcon />}
            size="small"
            onClick={onEdit}
          >
            Edit
          </Button>
        </ListSubheader>
      }
      className={classes.list}
    >
      {Object.entries(model).map(([label, value], idx) => (
        <div key={idx}>
          <StepDataListItem
            key={idx}
            label={label}
            value={value}
            isAvatar={label === 'Avatar'}
          />
          {idx !== Object.keys(model).length - 1 && <Divider />}
        </div>
      ))}
    </List>
  )
}

StepDataList.propTypes = {
  title: PropTypes.string.isRequired,
  onEdit: PropTypes.func.isRequired,
  model: PropTypes.object.isRequired,
}

export default StepDataList
