import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Input } from 'semantic-ui-react'

const Search = props => {
  return (
    <Grid centered>
      <Input
        placeholder='Search for yourself here'
        onChange={(e) => props.onSearchInput(e.target.value)}
        icon={'search'}
        size='huge'
        style={{padding: '20px 0', width: '400px'}}
      />
    </Grid>
  );
}

Search.propTypes = {
  onSearchInput: PropTypes.func.isRequired,
}

export default Search