// constants.js
//
// This file contains constants to be used within the app

const CONSTANTS = {}

CONSTANTS.ROLES = {
  ADM: 'Admin',
  SYS: 'System',
  CUS: 'Customer',
  MGR: 'Manager'
}

// Notificaton roles adds a 'USR' role, for the current user
CONSTANTS.NOTIFY_ROLES = Object.assign({}, CONSTANTS.ROLES)
CONSTANTS.NOTIFY_ROLES.USR = 'Current user'

CONSTANTS.NOTIFICATION_METHODS = {
  APP: 'Application',
  EMAIL: 'Email',
  SMS: 'SMS',
  API: 'API',
}

CONSTANTS.DAYS_WEEK = [
  { id: 0, value: 'Su' },
  { id: 1, value: 'Mo' },
  { id: 2, value: 'Tu' },
  { id: 3, value: 'We' },
  { id: 4, value: 'Th' },
  { id: 5, value: 'Fr' },
  { id: 6, value: 'Sa' },
]

CONSTANTS.TRIGGERS = {
  create: 'Create',
  ready: 'Ready',
  open: 'Open',
  complete: 'Complete',
  cancel: 'Cancel',
  reject: 'Reject',
  reopen: 'Re-open',
  skip: 'Skip',
  skipall: 'Skip all',
}

CONSTANTS.USER_STATUS = {
  active: 'Active',
  suspended: 'Suspended',
  pending: 'Pending',
  deleted: 'Deleted',
}

CONSTANTS.DEFAULT_AVATAR = '/images/default-avatar.png'

// Use this message if no event was specified - it emails ADM, so that we get to know about it
CONSTANTS.UNKNOWN_EVENT = 'unknown-event'
export default CONSTANTS
