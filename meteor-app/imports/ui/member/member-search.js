import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'semantic-ui-react'
import './member-search.css'

const Search = props => {
  return (
      <Input
        className='member-search'
        placeholder='Search Volunteers'
        onChange={props.onSearchInput}
        value={props.searchQuery}
        icon={'search'}
      />
  );
}

Search.propTypes = {
  onSearchInput: PropTypes.func.isRequired,
  searchQuery: PropTypes.string.isRequired,
}

export default Search