import { Meteor } from 'meteor/meteor'
import React from 'react'
import PropTypes from 'prop-types'
import { connectField } from 'uniforms'
import { TextField } from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete'
import styled from 'styled-components'
import { useTracker } from 'meteor/react-meteor-data'
import Rentals from '/imports/api/rentals/schema.js'
import { ToolItemSchema } from '/imports/api/events/schema.js'

const StyledRentalsSelector = styled.div`
  margin: 10px 0;
`

const RentalsSelector = ({ className, disabled, onChange, value, label }) => {
  // console.log({ value })

  const { loading, items } = useTracker(() => {
    const sub = Meteor.subscribe('all.tools')
    return {
      loading: !sub.ready(),
      items: Rentals.find({})
        .fetch()
        .map((tool) => ToolItemSchema.clean(tool)),
    }
  }, [])

  const renderList = () => {
    if (loading) {
      return null
    }
    // console.log(items)
    return (
      <Autocomplete
        multiple
        id="tags-standard"
        options={items}
        getOptionLabel={(option) => `${option.name}/${option.location}`}
        isOptionEqualToValue={(option, value) => option._id === value._id}
        value={value}
        filterSelectedOptions
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            label={label || 'Rentals'}
            placeholder="Select rentals"
          />
        )}
        disabled={disabled}
        onChange={(e, value) => onChange(value)}
      />
    );
  }

  return <StyledRentalsSelector>{renderList()}</StyledRentalsSelector>
}

RentalsSelector.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
    })
  ),
  disabled: PropTypes.bool,
  label: PropTypes.string,
}

const RentalsField = connectField(RentalsSelector)

export default RentalsField
