import { Meteor } from 'meteor/meteor'
import React from 'react'
import PropTypes from 'prop-types'
import { connectField } from 'uniforms'
import { TextField } from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete'
import styled from 'styled-components'
import { useTracker } from 'meteor/react-meteor-data'
import Locations from '/imports/api/locations/schema.js'
import { LocationItemSchema } from '/imports/api/events/schema.js'

const StyledLocationsSelector = styled.div`
  margin: 10px 0;
`

const LocationsSelector = ({ className, disabled, onChange, value, label }) => {
  // console.log({ value })
  // console.log(name, label)

  const { loading, items } = useTracker(() => {
    const sub = Meteor.subscribe('all.locations')
    return {
      loading: !sub.ready(),
      items: Locations.find({})
        .fetch()
        .map((course) => LocationItemSchema.clean(course)),
    }
  }, [])

  const renderList = () => {
    if (loading) {
      return null
    }
    // console.log(items)
    const selectedItem = items.find((item) => item._id === value)

    return (
      <Autocomplete
        options={items}
        getOptionLabel={(option) => `${option.title}/${option.difficulty}`}
        isOptionEqualToValue={(option, value) => option._id === value?._id}
        value={selectedItem || null}
        filterSelectedOptions
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            label={label || 'Location'}
            placeholder="Select locations"
          />
        )}
        disabled={disabled}
        onChange={(e, value) => onChange(value?._id)}
      />
    );
  }

  return <StyledLocationsSelector>{renderList()}</StyledLocationsSelector>
}

LocationsSelector.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
  disabled: PropTypes.bool,
  label: PropTypes.string,
}

const LocationsField = connectField(LocationsSelector)

export default LocationsField
