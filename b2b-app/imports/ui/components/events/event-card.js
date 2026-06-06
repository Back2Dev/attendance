import React, { useContext, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Button,
  Box,
} from '@mui/material'
import ImageIcon from '@mui/icons-material/Image'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'

import { EventsContext } from './events-context.js'

const StyledCard = styled(Card)`
  display: flex;
  flex-direction: column;
  height: 100%;
`

const ImagePlaceholder = styled(Box)`
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e0e0e0;
  color: #9e9e9e;
`

function formatPrice(cents) {
  if (!cents) return 'Free'
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(
    cents / 100
  )
}

function formatDate(date) {
  if (!date) return ''
  return new Intl.DateTimeFormat('en-AU', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

function BookingChip({ booking, isLoggedIn, onBook, onCancel, submitting, eventId }) {
  if (booking?.status === 'attended') {
    return <Chip label="Attended" color="success" size="small" />
  }
  if (booking?.status === 'booked') {
    return (
      <Chip
        label="Signed up"
        color="primary"
        size="small"
        onDelete={!submitting ? () => onCancel(booking._id) : undefined}
      />
    )
  }
  if (isLoggedIn) {
    return (
      <Button size="small" variant="contained" disabled={submitting} onClick={() => onBook(eventId)}>
        Book
      </Button>
    )
  }
  return null
}

function EventImage({ src }) {
  const [failed, setFailed] = useState(false)
  if (!src || failed) {
    return (
      <ImagePlaceholder>
        <ImageIcon fontSize="large" />
      </ImagePlaceholder>
    )
  }
  return (
    <Box
      component="img"
      src={src}
      alt=""
      onError={() => setFailed(true)}
      sx={{ width: '100%', height: 180, objectFit: 'cover', display: 'block' }}
    />
  )
}

function EventCard({ event }) {
  const { getBookingForEvent, getEventType, isLoggedIn, submitting, book, cancel } =
    useContext(EventsContext)

  const booking = getBookingForEvent(event._id)
  const eventType = getEventType(event.typeId)

  return (
    <StyledCard elevation={2}>
      <EventImage src={event.imageUrl} />
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1, minHeight: 32 }}>
          <Typography variant="h6" component="h2" sx={{ lineHeight: 1.2, flex: 1, minWidth: 0 }}>
            {event.name}
          </Typography>
          {eventType && (
            <Chip
              label={eventType.name}
              size="small"
              sx={{ ml: 1, backgroundColor: eventType.color, color: '#fff', flexShrink: 0 }}
            />
          )}
        </Box>

        {event.when && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
            <CalendarTodayIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {formatDate(event.when)}
            </Typography>
          </Box>
        )}

        {event.location && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
            <LocationOnIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {event.location}
            </Typography>
          </Box>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <AttachMoneyIcon fontSize="small" color="action" />
          <Typography variant="body2" color="text.secondary">
            {formatPrice(event.price)}
          </Typography>
        </Box>
      </CardContent>

      <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2 }}>
        <BookingChip
          booking={booking}
          isLoggedIn={isLoggedIn}
          onBook={book}
          onCancel={cancel}
          submitting={submitting}
          eventId={event._id}
        />
      </CardActions>
    </StyledCard>
  )
}

EventCard.propTypes = {
  event: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    imageUrl: PropTypes.string,
    when: PropTypes.instanceOf(Date),
    location: PropTypes.string,
    price: PropTypes.number,
    typeId: PropTypes.string,
  }).isRequired,
}

export default EventCard
