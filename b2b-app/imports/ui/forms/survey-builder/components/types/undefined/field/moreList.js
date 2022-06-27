import React, { Fragment } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import Menu from '@material-ui/core/Menu'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Checkbox from '@material-ui/core/Checkbox'
import { get } from 'lodash'
import { IconButton } from '@material-ui/core'
import PropTypes from 'prop-types'

const useStyles = makeStyles({
  list: {
    width: '100%',
    maxWidth: 360,
  },
  listIcon: {
    minWidth: '0px',
  },
})

const MoreList = ({
  part,
  path,
  isIdChecked,
  setIsIdChecked,
  onToggle,
  options = [],
}) => {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = React.useState(null)
  const ID = part['id'] ? 'id' : '_id'
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleToggle = (value) => () => {
    if (value.includes('id')) {
      return setIsIdChecked((prev) => ({
        ...prev,
        [path ?? value]: !prev[path ?? value],
      }))
    }
    onToggle(value)
  }

  const fieldOptions = [
    { label: 'ID', value: ID },
    { label: 'Value', value: 'value' },
    ...options,
  ]

  return (
    <Fragment>
      <IconButton aria-label="more" size="small" onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <List className={classes.list}>
          {fieldOptions.map((item) => {
            const labelId = item.label

            const checked =
              item.label === 'ID'
                ? isIdChecked[ID]
                : get(part, path ? `${path}.${item.value}` : item.value)

            return (
              <ListItem
                key={item.value}
                dense
                button
                onClick={handleToggle(path ? `${path}.${item.value}` : item.value)}
              >
                <ListItemIcon className={classes.listIcon}>
                  <Checkbox
                    edge="start"
                    checked={Boolean(checked || checked === '')}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ 'aria-labelledby': labelId }}
                  />
                </ListItemIcon>
                <ListItemText id={labelId} primary={item.label} />
              </ListItem>
            )
          })}
        </List>
      </Menu>
    </Fragment>
  )
}

MoreList.propTypes = {
  /** Object contains question/answers, each pid correspond to a specific part  */
  part: PropTypes.object.isRequired,
  /** a path act as an object key, and is used to get value from an object */
  path: PropTypes.string,
  /** object to record is ID option being checked */
  isIdChecked: PropTypes.object,
  /** function gets called when ID checked box is clicked*/
  setIsIdChecked: PropTypes.func,
  /** function gets called when checked box is clicked*/
  onToggle: PropTypes.func,
  /** checked box options*/
  options: PropTypes.array,
}

MoreList.defaultProps = {
  initialList: [''],
}

export { MoreList }
