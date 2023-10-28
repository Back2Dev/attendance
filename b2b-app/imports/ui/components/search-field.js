import React from 'react'
import InputAdornment from '@material-ui/core/InputAdornment'
import TextField from '@material-ui/core/TextField'
import SearchIcon from '@material-ui/icons/Search'

/**
 *
 * THIS MAY BE AN ORPHAN...
 *
 */
const CustomSearchField = ({ _id, _placeholder, callback }) => {
  return (
    <TextField
      id={_id}
      placeholder={_placeholder}
      onChange={callback}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    />
  )
}

export default CustomSearchField
