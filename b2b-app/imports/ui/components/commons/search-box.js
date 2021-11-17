import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react'
import PropTypes from 'prop-types'
// import { Meteor } from 'meteor/meteor';

import SearchIcon from '@material-ui/icons/Search'
import ClearIcon from '@material-ui/icons/Clear'
import IconButton from '@material-ui/core/IconButton'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'

const SearchBox = forwardRef(
  (
    {
      onChange,
      autoTrigger,
      autoTriggerTimeout,
      placeholder,
      clearLabel,
      defaultValue,
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

SearchBox.defaultProps = {
  autoTrigger: false,
  autoTriggerTimeout: 500,
  placeholder: 'Search ...',
  clearLabel: 'Clear',
  defaultValue: '',
}

export default SearchBox
