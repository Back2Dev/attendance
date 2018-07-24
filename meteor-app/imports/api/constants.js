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
  ASSIGNED: 2,
  IN_PROGRESS: 3,
  COMPLETED: 4,
  BIKE_PICKED_UP: 5,
  CANCELLED: 6,
}

export const JOB_STATUS_READABLE = {
  1: 'New',
  2: 'Assigned',
  3: 'In Progress',
  4: 'Completed',
  5: 'Bike Picked Up',
  6: 'Cancelled'
}

export const JOB_STATUS_BUTTON = {
  1: 'Assign Job',
  2: 'Start Job',
  3: 'Complete Job',
  4: 'Pick Up Bike',
  5: 'Order Completed',
  6: 'Re-Open Job'
}

export default CONSTANTS
