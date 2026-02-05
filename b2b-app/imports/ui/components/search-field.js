import React from 'react'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import SearchIcon from '@mui/icons-material/Search'

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
