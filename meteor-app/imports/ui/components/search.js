import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { Input } from 'semantic-ui-react'

const Search = props => {
  return (
    <div>
    <Input 
      placeholder='Type name to search'
      onChange={props.onSearchInput}
      value={props.searchQuery}
      icon={'search'}
    />
    </div>
  );
}

Search.propTypes = {
  onSearchInput: PropTypes.func.isRequired,
  searchQuery: PropTypes.string.isRequired,
}

export default Search