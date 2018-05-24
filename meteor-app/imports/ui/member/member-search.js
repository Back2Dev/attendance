import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Input } from 'semantic-ui-react'

const Search = props => {
  return (
    <Grid centered>
      <Input
        placeholder='Type name to search'
        onChange={(e) => props.onSearchInput(e.target.value)}
        icon={'search'}
        style={{padding: '20px 0'}}
      />
    </Grid>
  );
}

Search.propTypes = {
  onSearchInput: PropTypes.func.isRequired,
}

export default Search