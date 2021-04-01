import { Meteor } from 'meteor/meteor'
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import ReactMarkdown from 'react-markdown'

import { Menu, MenuItem, IconButton } from '@material-ui/core'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'
import CONSTANTS from '/imports/api/constants'
import { showError } from '/imports/ui/utils/toast-alerts'

import { LocalNotificationItems } from '/imports/api/notifications/schema.js'

import Avatar from '/imports/ui/components/commons/avatar.js'
import { convertAvatar } from '/imports/api/util.js'

// const Item = React.forwardRef(({ item, onClick }, ref) => {
const Item = ({ item, onClick }) => {
  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const updateItemReadStatus = (newRead) => {
    Meteor.call(
      'NotiMarkItemRead',
      { itemId: item._id, read: newRead },
      (error, result) => {
        if (error) {
          showError(error.message)
        }
        if (result.status === 'failed') {
          showError(result.message)
        }
        if (result.status === 'success') {
          // update the local item, or should we do this despite result?
          LocalNotificationItems.update({ _id: item._id }, { $set: { read: newRead } })
        }
      }
    )
  }

  const handleReadMarking = () => {
    const newRead = !item.read
    updateItemReadStatus(newRead)
    handleClose()
  }

  const renderDate = () => {
    if (moment(item.createdAt).isBefore(moment().subtract(1, 'day'))) {
      return moment(item.createdAt).format('DD/MM/YYYY HH:mm')
    }
    return moment(item.createdAt).fromNow()
  }

  const classes = ['item']
  if (!item.read) {
    classes.push('new')
  }
  return (
    <MenuItem className={classes.join(' ')}>
      <Avatar
        size={30}
        url={convertAvatar(item?.data?.user?.avatar)}
        alt={item?.data?.user?.name}
      />
      <div
        className="message-container"
        onClick={() => {
          if (item.read !== true) {
            updateItemReadStatus(true)
          }
          onClick(item)
        }}
      >
        <div className="message">
          <ReactMarkdown source={item.message || 'N/A'} />
        </div>
        <div className="info">{renderDate()}</div>
      </div>
      <div className="more-icon">
        <IconButton aria-label="more" size="small" onClick={handleClick}>
          <MoreHorizIcon fontSize="small" />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleReadMarking}>
            Mark as {item.read ? 'unread' : 'read'}
          </MenuItem>
        </Menu>
      </div>
    </MenuItem>
  )
}

Item.propTypes = {
  item: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
}

export default Item
