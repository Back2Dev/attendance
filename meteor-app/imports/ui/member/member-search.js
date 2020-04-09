import React from 'react'
import PropTypes from 'prop-types'
import { Input } from 'semantic-ui-react'

import './member-search.css'

const MemberSearch = props => {
  return (
    <Input
      className="member-search"
      placeholder="Search"
      onChange={props.onSearchInput}
      value={props.searchQuery}
      icon={'search'}
    />
  )
}

MemberSearch.propTypes = {
  onSearchInput: PropTypes.func.isRequired,
  searchQuery: PropTypes.string.isRequired,
  memberWords: PropTypes.string
}

export default MemberSearch
