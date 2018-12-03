import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'semantic-ui-react'
import './member-search.css'

const Search = props => {
  const searchFor = (props.memberWords) ? `Search ${props.memberWords}` : 'Search Volunteers'
  return (
      <Input
        className='member-search'
        placeholder={searchFor}
        onChange={props.onSearchInput}
        value={props.searchQuery}
        icon={'search'}
      />
  );
}

Search.propTypes = {
  onSearchInput: PropTypes.func.isRequired,
  searchQuery: PropTypes.string.isRequired,
  memberWords: PropTypes.string,
}

export default Search