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
import { useRecoilState } from 'recoil'
import { IdAtom } from '$sb/recoil/atoms'

const useStyles = makeStyles({
  list: {
    width: '100%',
    maxWidth: 360,
  },
  listIcon: {
    minWidth: '0px',
  },
})

const OptionList = ({ options = {}, onToggle, showField = {} }) => {
  const classes = useStyles()
  // const [showId, setShowId] = useRecoilState(IdAtom(pid_index))
  const [anchorEl, setAnchorEl] = React.useState(null)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

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
          {Object.entries(options).map(([key, label]) => (
            <ListItem key={key} button onClick={() => onToggle(key)}>
              <ListItemIcon className={classes.listIcon}>
                <Checkbox
                  edge="start"
                  checked={showField[key]}
                  tabIndex={-1}
                  disableRipple
                />
              </ListItemIcon>
              <ListItemText id={key} primary={label} />
            </ListItem>
          ))}
        </List>
      </Menu>
    </Fragment>
  )
}

OptionList.propTypes = {
  /** function gets called when checked box is clicked*/
  onToggle: PropTypes.func,
  /** The dropdown options after each input field*/
  options: PropTypes.object,
  /** show fields that are selected through the dropdown options*/
  showField: PropTypes.object,
}

export { OptionList }
