import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
// import { Meteor } from 'meteor/meteor';

import SearchIcon from '@material-ui/icons/Search'
import ClearIcon from '@material-ui/icons/Clear'
import IconButton from '@material-ui/core/IconButton'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'

function SearchBox({
  onChange,
  autoTrigger,
  autoTriggerTimeout,
  placeholder,
  clearLabel,
  defaultValue,
}) {
  const [searchBoxValue, setSearchBoxValue] = useState(defaultValue)

  const timer = useRef(null)

  useEffect(() => {
    if (autoTrigger) {
      clearTimeout(timer.current)
      timer.current = setTimeout(() => {
        onChange(searchBoxValue)
      }, autoTriggerTimeout)
    }
    return () => clearTimeout(timer.current)
  }, [searchBoxValue, onChange, autoTrigger, autoTriggerTimeout])

  const handleEnterKey = (e) => {
    if (e.key === 'Enter') {
      onChange(searchBoxValue)
    }
  }

  return (
    <TextField
      className="search-box"
    
      placeholder={placeholder}
      value={searchBoxValue}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              size="small"
              aria-label={clearLabel}
              onClick={() => {
                setSearchBoxValue('')
                onChange('')
              }}
            >
              <ClearIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
      onKeyDown={handleEnterKey}
      onChange={(e) => {
        setSearchBoxValue(e.target.value)
      }}
    />
  )
}

SearchBox.propTypes = {
  onChange: PropTypes.func.isRequired,
  autoTrigger: PropTypes.bool, // if false, user needs to hit enter key
  autoTriggerTimeout: PropTypes.number,
  placeholder: PropTypes.string,
  clearLabel: PropTypes.string,
  defaultValue: PropTypes.string,
}

SearchBox.defaultProps = {
  autoTrigger: false,
  autoTriggerTimeout: 500,
  placeholder: 'Search ...',
  clearLabel: 'Clear',
  defaultValue: '',
}

export default SearchBox
