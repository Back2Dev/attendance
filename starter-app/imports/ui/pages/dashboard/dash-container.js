import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import WarningIcon from '@material-ui/icons/Warning'
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined'
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive'
import HomeWorkIcon from '@material-ui/icons/HomeWork'
import AssignmentIcon from '@material-ui/icons/Assignment'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import List from './dash'
import moment from 'moment'
import { AccountContext } from '/imports/ui/contexts/account-context.js'

const Loading = (props) => {
  // if (props.loading) return <div>Loading...</div>
  return <List {...props}></List>
}

const Tracker = withTracker(() => {
  return {}
})(Loading)

export default Tracker
