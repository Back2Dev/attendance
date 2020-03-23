// constants.js
//
// This file contains constants to be used within the app

const CONSTANTS = {
  // Order status values
  ORDER_STATUS_NEW: 1,
  ORDER_STATUS_SENT: 2,
  ORDER_STATUS_RECEIVED: 3,
  ORDER_STATUS_RECONCILED: 4,
  ORDER_STATUS_QUERIED: 5,
  ORDER_STATUS_CANCELLED: 6,

  // Part status values
  PART_STATUS_OK: 101,
  PART_STATUS_DELETED: 102,
  PART_STATUS_AUTO_CREATED: 103
}

// Human readable lookup table:
CONSTANTS.ORDER_STATUS_READABLE = {
  1: 'New',
  2: 'Sent',
  3: 'Received',
  4: 'Reconciled',
  5: 'Queried',
  6: 'Cancelled'
}

// Human readable lookup table:
CONSTANTS.PART_STATUS_READABLE = {
  101: 'OK',
  102: 'Deleted',
  103: 'Auto created'
}

export const JOB_STATUS = {
  NEW: 1,
  IN_PROGRESS: 2,
  QUALITY_CHECK: 3,
  READY_FOR_PICK_UP: 4,
  PICKED_UP: 5,
  CANCELLED: 6
}

export const JOB_STATUS_ALL = [1, 2, 3, 4]

export const JOB_STATUS_COMPLETE = [5, 6]

export const JOB_STATUS_READABLE = {
  1: 'New',
  2: 'In Progress',
  3: 'Quality Check',
  4: 'Ready for Pick Up',
  5: 'Picked Up',
  6: 'Cancelled'
}

export const JOB_STATUS_BUTTON = {
  1: 'Start',
  2: 'Service Done',
  3: 'Quality Checked',
  4: 'Picked Up',
  5: 'Completed',
  6: 'Re-Open'
}

export const JOB_STATUS_STYLES = {
  1: { backgroundColor: 'lightblue', fontSize: '1.5em' },
  2: { backgroundColor: '#d2abd2', fontSize: '1.5em' },
  3: { backgroundColor: '#ffffba', fontSize: '1.5em' },
  4: { backgroundColor: '#ABD3B8', fontSize: '1.5em' },
  5: { backgroundColor: '#ABD3B8', fontSize: '1.5em' },
  6: { backgroundColor: '#ffb2b2', fontSize: '1.5em' }
}

export const LOG_EVENT_READABLE = {
  20: 'Update Status',
  21: 'Update Mechanic',
  22: 'New Job Created By',
  23: 'Phone call',
  24: 'SMS sent',
  26: 'Paid',
  27: 'Unpaid'
}

export const STATUS_UPDATE = 'STATUS_UPDATE'
export const MECHANIC_UPDATE = 'MECHANIC_UPDATE'
export const NEW_JOB = 'NEW_JOB'
export const PHONE_CALL = 'PHONE_CALL'
export const SEND_SMS = 'SEND_SMS'
export const PAID = 'PAID'
export const UNPAID = 'UNPAID'

export const LOG_EVENT_TYPES = {
  [STATUS_UPDATE]: 20,
  [MECHANIC_UPDATE]: 21,
  [NEW_JOB]: 22,
  [PHONE_CALL]: 23,
  [SEND_SMS]: 24,
  [PAID]: 26,
  [UNPAID]: 27
}

CONSTANTS.SERVICE_TYPES = {
  Major: 'Major Service',
  Minor: 'Minor Service'
}

// Product Type values
CONSTANTS.PRODUCT_TYPES = {
  PASS: 'pass',
  COURSE: 'course',
  MEMBERSHIP: 'membership'
}

// Human readable lookup table:
CONSTANTS.PRODUCT_TYPES_READABLE = {
  pass: 'Pass',
  course: 'Course',
  membership: 'Membership'
}

CONSTANTS.CART_STATUS = {
  READY: 'ready',
  DENIED: 'denied',
  CANCELLED: 'cancelled',
  COMPLETE: 'complete',
  ENUM: ['ready', 'denied', 'cancelled', 'complete']
}

CONSTANTS.DAYS_WEEK = [
  { id: 0, value: 'Sun' },
  { id: 1, value: 'Mon' },
  { id: 2, value: 'Tue' },
  { id: 3, value: 'Wed' },
  { id: 4, value: 'Thu' },
  { id: 5, value: 'Fri' },
  { id: 6, value: 'Sat' }
]

CONSTANTS.ROLES = ['superadmin', 'register', 'signin', 'servicing', 'paynow', 'parts', 'admin', 'member', 'shop']

export default CONSTANTS
