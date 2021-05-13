import { Meteor } from 'meteor/meteor'
import React from 'react'
import PropTypes from 'prop-types'
import { connectField } from 'uniforms'
import { TextField } from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import styled from 'styled-components'
import { useTracker } from 'meteor/react-meteor-data'
import Tools from '/imports/api/tools/schema.js'
import { ToolItemSchema } from '/imports/api/events/schema.js'

const StyledToolsSelector = styled.div`
  margin: 10px 0;
`

const ToolsSelector = ({ className, disabled, onChange, value, label }) => {
  // console.log({ value })

  const { loading, items } = useTracker(() => {
    const sub = Meteor.subscribe('all.tools')
    return {
      loading: !sub.ready(),
      items: Tools.find({})
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
        getOptionSelected={(option, value) => option._id === value._id}
        value={value}
        filterSelectedOptions
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            label={label || 'Tools'}
            placeholder="Select tools"
          />
        )}
        disabled={disabled}
        onChange={(e, value) => onChange(value)}
      />
    )
  }

  return <StyledToolsSelector>{renderList()}</StyledToolsSelector>
}

ToolsSelector.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
    })
  ),
  disabled: PropTypes.bool,
  label: PropTypes.string,
}

const ToolsField = connectField(ToolsSelector)

export default ToolsField
