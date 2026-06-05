import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { TableRow, TableCell, Chip, Button, Typography, Box } from '@mui/material'

import { EventsContext } from './events-context.js'

function formatPrice(cents) {
  if (!cents) return 'Free'
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(
    cents / 100
  )
}

function formatDate(date) {
  if (!date) return ''
  return new Intl.DateTimeFormat('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

function EventCompact({ event }) {
  const { getBookingForEvent, getEventType, isLoggedIn, submitting, book, cancel } =
    useContext(EventsContext)

  const booking = getBookingForEvent(event._id)
  const eventType = getEventType(event.typeId)

  let bookingCell = null
  if (booking?.status === 'attended') {
    bookingCell = <Chip label="Attended" color="success" size="small" />
  } else if (booking?.status === 'booked') {
    bookingCell = (
      <Chip
        label="Signed up"
        color="primary"
        size="small"
        onDelete={!submitting ? () => cancel(booking._id) : undefined}
      />
    )
  } else if (isLoggedIn) {
    bookingCell = (
      <Button size="small" variant="outlined" disabled={submitting} onClick={() => book(event._id)}>
        Book
      </Button>
    )
  }

  return (
    <TableRow hover>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        <Typography variant="body2">{formatDate(event.when)}</Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body2" fontWeight={500}>
          {event.name}
        </Typography>
      </TableCell>
      <TableCell>
        {eventType && (
          <Chip
            label={eventType.name}
            size="small"
            sx={{ backgroundColor: eventType.color, color: '#fff' }}
          />
        )}
      </TableCell>
      <TableCell>
        <Typography variant="body2" color="text.secondary">
          {event.location || '—'}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body2">{formatPrice(event.price)}</Typography>
      </TableCell>
      <TableCell align="right">{bookingCell}</TableCell>
    </TableRow>
  )
}

EventCompact.propTypes = {
  event: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    when: PropTypes.instanceOf(Date),
    location: PropTypes.string,
    price: PropTypes.number,
    typeId: PropTypes.string,
  }).isRequired,
}

export default EventCompact
