import { Meteor } from 'meteor/meteor'
import React, { useEffect, useRef, useReducer } from 'react'
import { useHistory } from 'react-router-dom'
import { useTracker } from 'meteor/react-meteor-data'
import styled from 'styled-components'
import moment from 'moment'

import { Badge, Button, Menu, MenuItem } from '@material-ui/core'
import NotificationNoneIcon from '@material-ui/icons/NotificationsNone'
import NotificationActiveIcon from '@material-ui/icons/NotificationsActive'

import {
  Notifications,
  LocalNotificationItems,
} from '/imports/api/notifications/schema.js'
import Loading from '/imports/ui/components/commons/loading.js'
import { showError } from '/imports/ui/utils/toast-alerts'

// import ChatClientHelper from '/imports/modules/chat/api/helper.js'

import Item from './item'

const StyledNotificationsIcon = styled.div`
  display: flex;
  button {
    padding: 12px;
    min-width: unset;
    color: #ffffffb8;
  }
  &.unread {
    .icon {
      color: #fd7e14e3;
    }
  }
  &.opened {
    button {
      color: #ffffff;
    }
  }
  .badge {
    .badge {
      width: 20px;
      height: 20px;
      top: 0px;
      right: 5px;
      background: #ffffff;
      color: #5a2d0ccf;
      line-height: 20px;
      font-size: 12px;
      font-weight: bold;
      padding: 0;
    }
  }
`

const StyledMenu = styled(Menu)`
  .notification-menu {
    width: calc(100% - 32px);
    max-width: 430px;
  }
  .item {
    padding-left: 5px;
    padding-right: 5px;
    padding-top: 5px;
    padding-bottom: 5px;
    height: auto;
    &.new {
      background: #ec8c0b33;
    }
    .avatar {
      margin-right: 10px;
    }
    .message-container {
      flex: 1;
      .message {
        white-space: normal;
        max-height: 2.5em;
        line-height: 1rem;
        text-overflow: clip;
        font-size: 0.9rem;
        overflow: hidden;
        p {
          margin: 3px 0;
        }
      }
      .info {
        color: #000000a3;
        font-size: 0.8rem;
        line-height: 0.9rem;
      }
    }
  }
  .menu-header {
    padding: 0 5px;
    .title {
      flex: 1;
      font-family: 'GothamRoundedMedium';
    }
    .action {
      button {
        text-transform: none;
      }
    }
  }
  .menu-footer {
    padding: 0 5px;
    .load-more {
      flex: 1;
      text-align: center;
      button {
        line-height: 1.2;
        padding: 3px 15px;
        text-transform: none;
      }
    }
  }
`

function reducer(state, action) {
  const { type, payload } = action
  switch (type) {
    case 'setLoading':
      return {
        ...state,
        loading: payload,
      }
    case 'setItems': {
      const { items, limit, updatedAt } = payload
      // update minimongo
      items.map((item) => {
        // check if existing
        const existingItem = LocalNotificationItems.findOne({ _id: item._id })
        if (!existingItem) {
          LocalNotificationItems.insert(item)
        } else if (existingItem.updatedAt !== item.updatedAt) {
          const { _id, ...rest } = item
          LocalNotificationItems.update({ _id }, { $set: rest })
        }
        return item._id
      })
      return {
        ...state,
        loading: false,
        lastChecked: moment(updatedAt).add(1, 'seconds').toDate(),
        noMore: items.length < limit,
      }
    }
    case 'setAnchorEl':
      return {
        ...state,
        anchorEl: payload,
      }
    default:
      return state
  }
}

const NotificationsIcon = () => {
  const getRecentlyTimeout = useRef(null)
  const mounted = useRef(true)
  useEffect(
    () => () => {
      console.log('unmounted')
      mounted.current = false
      Meteor.clearTimeout(getRecentlyTimeout.current)
    },
    []
  )

  const firstTimeFetch = useRef(true)

  const [state, dispatch] = useReducer(reducer, {
    loading: false,
    lastChecked: null,
    anchorEl: null,
    noMore: false,
  })

  const { loading, lastChecked, anchorEl, noMore } = state

  const { push } = useHistory()

  const notification = useTracker(() => {
    if (Meteor.isServer) {
      return
    }
    const sub = Meteor.subscribe('notifications.mine')
    dispatch({ type: 'setLoading', payload: !sub.ready() })
    const item = Notifications.findOne({ userId: Meteor.userId() })
    return item
  }, [])

  const { _id: notificationId, updatedAt, checkedAt } = notification || {}

  const getRecently = () => {
    dispatch({ type: 'setLoading', payload: true })
    const limit = 10
    Meteor.clearTimeout(getRecentlyTimeout.current)
    getRecentlyTimeout.current = Meteor.setTimeout(() => {
      if (mounted.current !== true) {
        return
      }
      console.log('call now', notificationId)
      Meteor.call(
        'notificationsGetRecently',
        {
          notificationId,
          limit,
          firstTimeFetch: firstTimeFetch.current,
        },
        (error, result) => {
          if (mounted.current !== true) {
            return
          }
          if (error) {
            dispatch({ type: 'setLoading', payload: false })
            console.log('error', error.message)
            return
          }
          firstTimeFetch.current = false
          dispatch({ type: 'setItems', payload: { items: result, limit, updatedAt } })
        }
      )
    }, 300)
  }

  // get once
  useEffect(() => {
    if (!notificationId) {
      return
    }
    getRecently()
  }, [notificationId])

  useEffect(() => {
    if (!notificationId) {
      return
    }
    if (firstTimeFetch.current === true) {
      return
    }
    if (lastChecked && lastChecked >= updatedAt) {
      return
    }
    console.log(notificationId, updatedAt, lastChecked)

    getRecently()
  }, [updatedAt, lastChecked])

  const handleClick = (event) => {
    dispatch({ type: 'setAnchorEl', payload: event.currentTarget })
  }

  const handleClose = () => {
    dispatch({ type: 'setAnchorEl', payload: null })
    // call method check
    Meteor.call('notificationsCheck', {}, (error) => {
      if (error) {
        console.log('error', error.message)
      }
    })
  }

  const handleItemClick = (item) => {
    handleClose()
    // console.log(item);
    // if (item.type === 'chat' && item.data) {
    //   const { conversationId } = item.data
    //   console.log('conversationId', conversationId)
    //   ChatClientHelper.addConversation({ conversationId })
    //   return
    // }
    if (item.url) {
      const absoluteUrlPatt = /^\s*http(s|):/i
      if (absoluteUrlPatt.test(item.url)) {
        // open new tab
        window.open(item.url)
      } else {
        push(item.url)
      }
    }
  }

  const handleLoadMore = () => {
    if (!notification) {
      console.log('no notification')
      return
    }
    // get the last notification
    let before = null
    const lastItem = LocalNotificationItems.findOne({}, { sort: { createdAt: 1 } })
    if (lastItem) {
      before = lastItem.createdAt
    }
    if (!before) {
      console.log('no before date')
      return
    }
    dispatch({ type: 'setLoading', payload: true })
    const limit = 30
    Meteor.call(
      'notificationsGetMore',
      {
        notificationId,
        before,
        limit,
      },
      (error, result) => {
        if (error) {
          dispatch({ type: 'setLoading', payload: false })
          console.log('error', error.message)
          return
        }
        dispatch({ type: 'setItems', payload: { items: result, limit, updatedAt } })
      }
    )
  }

  const markAllRead = () => {
    Meteor.call('NotiMarkAllRead', (error, result) => {
      if (error) {
        showError(error.message)
      }
      if (result.status === 'failed') {
        showError(result.message)
      }
      if (result.status === 'success') {
        // update the local item, or should we do this despite result?
        LocalNotificationItems.update({}, { $set: { read: true } }, { multi: true })
      }
    })
  }

  const renderItems = () => {
    const userNotifications = Notifications.find({ userId: Meteor.userId() }).fetch()
    const notificationIds = userNotifications.map((notification) => notification._id)
    const items = LocalNotificationItems.find(
      { status: 1, notificationId: { $in: notificationIds } },
      { sort: { createdAt: -1 } }
    ).fetch()
    if (items.length === 0) {
      return (
        <MenuItem onClick={handleClose} className="no-notification">
          No notification
        </MenuItem>
      )
    }
    return items.map((item) => (
      <Item key={item._id} item={item} onClick={handleItemClick} />
    ))
  }

  let isThereNewItems = false
  let newItemsCount = 0
  if (notification) {
    if (updatedAt && (checkedAt === null || updatedAt > checkedAt)) {
      isThereNewItems = true
    }
    // count new items
    newItemsCount = LocalNotificationItems.find({
      status: 1,
      read: { $ne: true },
    }).count()
  }

  const classes = ['notifications']
  if (isThereNewItems) {
    classes.push('unread')
  }
  if (anchorEl) {
    classes.push('opened')
  }
  // console.log('classes', classes);

  return (
    <StyledNotificationsIcon className={classes.join(' ')}>
      <Button
        aria-owns={anchorEl ? 'notifications-menu' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <Badge
          color="primary"
          badgeContent={newItemsCount}
          invisible={!newItemsCount}
          className="badge"
          classes={{ badge: 'badge' }}
          data-cy="notifications-bell"
        >
          {isThereNewItems ? (
            <NotificationActiveIcon className="icon" />
          ) : (
            <NotificationNoneIcon className="icon" />
          )}
        </Badge>
      </Button>
      <StyledMenu
        id="notifications-menu"
        anchorEl={anchorEl}
        anchorReference="anchorEl"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        getContentAnchorEl={null}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        classes={{ paper: 'notification-menu' }}
      >
        <MenuItem className="menu-header" dense disableRipple disableGutters>
          <div className="title">Notifications</div>
          <div className="action">
            <Button onClick={markAllRead} size="small">
              Mark all as read
            </Button>
          </div>
        </MenuItem>
        {renderItems()}
        {noMore === false ? (
          <MenuItem className="menu-footer" dense disableRipple disableGutters>
            <div className="load-more">
              <Button onClick={handleLoadMore}>Load more...</Button>
            </div>
          </MenuItem>
        ) : null}
        <Loading loading={loading} />
      </StyledMenu>
    </StyledNotificationsIcon>
  )
}

NotificationsIcon.propTypes = {}

NotificationsIcon.defaultProps = {}

export default NotificationsIcon
