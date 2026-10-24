import React from 'react'
import { Meteor } from 'meteor/meteor'
import { useTracker } from 'meteor/react-meteor-data'
import Locations from '/imports/api/locations/schema.js'
import { LocationItemSchema } from '/imports/api/events/schema.js'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'

const LocationWidget = ({ value, onChange, label, disabled, id }) => {
  const { items, loading } = useTracker(() => {
    const sub = Meteor.subscribe('all.locations')
    return {
      loading: !sub.ready(),
      items: Locations.find({}).fetch().map((course) => LocationItemSchema.clean(course)),
    }
  }, [])

  const selected = items.find((item) => item._id === value) || null

  return (
    <Autocomplete
      id={id}
      options={items}
      getOptionLabel={(opt) => opt.title || ''}
      value={selected}
      loading={loading}
      disabled={disabled}
      onChange={(_, newValue) => onChange(newValue?._id || undefined)}
      renderInput={(params) => <TextField {...params} label={label} variant="outlined" />}
    />
  )
}

export default LocationWidget
