// copied from member-search.js  -  can be edited for part search?

import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'semantic-ui-react'
import './ordering-part-search.css'

const searchParts = props => {
  return (
      <Input
        className='ordering-part-search'
        placeholder='Search Parts'
        onChange={props.onSearchInput}
        value={props.searchQuery}
        icon={'search'}
      />
  );
}

searchParts.propTypes = {
  onSearchInput: PropTypes.func.isRequired,
  searchQuery: PropTypes.string.isRequired,
}

export default searchParts
