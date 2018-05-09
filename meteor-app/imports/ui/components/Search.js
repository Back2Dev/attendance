import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { Search as SemanticUiSearch } from 'semantic-ui-react'

const Search = props => {
  return (
    <div>
    <input 
      placeholder='Type name to search'
      onChange={props.onSearchInput}
      value={props.searchQuery}
    />
    </div>
  );
}

Search.propTypes = {
  onSearchInput: PropTypes.func.isRequired,
  searchQuery: PropTypes.string.isRequired,
}

export default Search