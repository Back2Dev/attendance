import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'semantic-ui-react'

const Search = props => {
  return (
    <div style={{ width: '300px' }}>
      <Input
        placeholder='Search for yourself here'
        onChange={props.onSearchInput}
        value={props.searchQuery}
        icon={'search'}
        fluid
      />
    </div>
  );
}

Search.propTypes = {
  onSearchInput: PropTypes.func.isRequired,
  searchQuery: PropTypes.string.isRequired,
}

export default Search