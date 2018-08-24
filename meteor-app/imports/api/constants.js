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
}

// // Human readable lookup table:
// CONSTANTS.ORDER_STATUS_READABLE = {
//   ORDER_STATUS_NEW: 'New',
//   ORDER_STATUS_SENT: 'Sent',
//   ORDER_STATUS_RECEIVED: 'Received',
//   ORDER_STATUS_RECONCILED: 'Reconciled',
//   ORDER_STATUS_QUERIED: 'Queried',
//   ORDER_STATUS_CANCELLED: 'Cancelled',
// }

// Human readable lookup table:
CONSTANTS.ORDER_STATUS_READABLE = {
  1: 'New',
  2: 'Sent',
  3: 'Received',
  4: 'Reconciled',
  5: 'Queried',
  6: 'Cancelled',
}

export const JOB_STATUS = {
  NEW: 1,
  IN_PROGRESS: 2,
  QUALITY_CHECK: 3,
  READY_FOR_PICK_UP: 4,
  PICKED_UP: 5,
  CANCELLED: 6,
}

export const JOB_STATUS_READABLE = {
  1: 'New',
  2: 'In Progress',
  3: 'Quality Check',
  4: 'Ready for Pick Up',
  5: 'Picked Up',
  6: 'Cancelled',
}

export const JOB_STATUS_BUTTON = {
  1: 'Start',
  2: 'Service Done',
  3: 'Quality Checked',
  4: 'Picked Up',
  5: 'Completed',
  6: 'Re-Open'
}

export default CONSTANTS
