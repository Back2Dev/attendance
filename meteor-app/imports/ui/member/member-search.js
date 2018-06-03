import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Input } from 'semantic-ui-react'

const Search = props => {
  return (
    <div style={{ width: '300px' }}>
      <Input
        placeholder='Search for yourself here'
        onChange={props.onSearchInput}
        icon={'search'}
        fluid
      />
    </div>
  );
}

Search.propTypes = {
  onSearchInput: PropTypes.func.isRequired,
}

export default Search