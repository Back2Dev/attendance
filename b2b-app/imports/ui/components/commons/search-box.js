import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react'
import PropTypes from 'prop-types'
// import { Meteor } from 'meteor/meteor';

import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'

const SearchBox = forwardRef(
  (
    {
      onChange,
      autoTrigger = false,
      autoTriggerTimeout = 500,
      placeholder = 'Search ...',
      clearLabel = 'Clear',
      defaultValue = '',
      variant = 'standard',
      disabled,
    },
    ref
  ) => {
    const [searchBoxValue, setSearchBoxValue] = useState(defaultValue)

    const mounted = useRef(true)
    useEffect(() => () => (mounted.current = false), [])

    const timer = useRef(null)

    useImperativeHandle(ref, () => ({
      clear: () => {
        if (mounted.current) {
          setSearchBoxValue('')
        }
      },
    }))

    useEffect(() => {
      if (autoTrigger) {
        clearTimeout(timer.current)
        timer.current = setTimeout(() => {
          onChange(searchBoxValue)
        }, autoTriggerTimeout)
      }
      return () => clearTimeout(timer.current)
    }, [searchBoxValue, autoTrigger, autoTriggerTimeout])

    const handleEnterKey = (e) => {
      if (e.key === 'Enter') {
        onChange(searchBoxValue)
      }
    }

    return (
      <TextField
        className="search-box"
        variant={variant}
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
                disabled={disabled === true}
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
        disabled={disabled === true}
      />
    )
  }
)
SearchBox.displayName = 'SearchBox'

SearchBox.propTypes = {
  onChange: PropTypes.func.isRequired,
  autoTrigger: PropTypes.bool, // if false, user needs to hit enter key
  autoTriggerTimeout: PropTypes.number,
  placeholder: PropTypes.string,
  clearLabel: PropTypes.string,
  defaultValue: PropTypes.string,
  variant: PropTypes.string,
  disabled: PropTypes.bool,
}


export default SearchBox
