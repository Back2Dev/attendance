import React from 'react'
import PropTypes from 'prop-types'
import { InputAdornment, TextField } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

import './member-search.css'

const MemberSearch = props => {
  return (
    <TextField
      className="member-search"
      placeholder="Search"
      onChange={props.onSearchInput}
      value={props.searchQuery}
      variant="outlined"
      size="small"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        )
      }}
    />
  )
}

MemberSearch.propTypes = {
  onSearchInput: PropTypes.func.isRequired,
  searchQuery: PropTypes.string.isRequired,
  memberWords: PropTypes.string
}

export default MemberSearch
