import React, { useContext } from 'react'
import styled from 'styled-components'
import {
  Box,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  Switch,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
} from '@mui/material'
import ViewModuleIcon from '@mui/icons-material/ViewModule'
import ViewListIcon from '@mui/icons-material/ViewList'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'

import { EventsContext } from './events-context.js'
import EventCard from './event-card.js'
import EventCompact from './event-compact.js'
import EventsCalendar from './events-calendar.js'

const StyledEventsList = styled.div`
  padding: 16px 0;
`

const Controls = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 24px;
`

function EventsList() {
  const { loading, events, viewMode, setViewMode, showPast, setShowPast } =
    useContext(EventsContext)

  const handleViewChange = (_e, val) => {
    if (val) setViewMode(val)
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    )
  }

  const renderCards = () => (
    <Grid container spacing={3}>
      {events.map((event) => (
        <Grid item key={event._id} xs={12} sm={6} md={4} lg={3}>
          <EventCard event={event} />
        </Grid>
      ))}
    </Grid>
  )

  const renderCompact = () => (
    <TableContainer component={Paper} elevation={1}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Event</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Price</TableCell>
            <TableCell align="right">Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {events.map((event) => (
            <EventCompact key={event._id} event={event} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )

  const renderCalendar = () => <EventsCalendar />

  const isEmpty = !loading && events.length === 0

  return (
    <StyledEventsList>
      <Controls>
        <ToggleButtonGroup value={viewMode} exclusive onChange={handleViewChange} size="small">
          <ToggleButton value="cards" aria-label="Card view">
            <ViewModuleIcon fontSize="small" />
          </ToggleButton>
          <ToggleButton value="compact" aria-label="List view">
            <ViewListIcon fontSize="small" />
          </ToggleButton>
          <ToggleButton value="calendar" aria-label="Calendar view">
            <CalendarMonthIcon fontSize="small" />
          </ToggleButton>
        </ToggleButtonGroup>

        <FormControlLabel
          control={
            <Switch
              checked={showPast}
              onChange={(e) => setShowPast(e.target.checked)}
              size="small"
            />
          }
          label="Show past events"
        />
      </Controls>

      {isEmpty ? (
        <Typography color="text.secondary" align="center" sx={{ py: 6 }}>
          No {showPast ? 'past' : 'upcoming'} events found.
        </Typography>
      ) : (
        <>
          {viewMode === 'cards' && renderCards()}
          {viewMode === 'compact' && renderCompact()}
          {viewMode === 'calendar' && renderCalendar()}
        </>
      )}
    </StyledEventsList>
  )
}

export default EventsList
