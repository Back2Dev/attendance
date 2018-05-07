import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { Search as SemanticUiSearch } from 'semantic-ui-react'

export default class Search extends React.Component {

  searchVolunteers = (e) => {
    let value = this.refs.search.value;
    if (value !== '' && e.keyCode === 13) {
      this.props.searchQuery.set(value);
      this.props.searching.set(true);
    }

    if (value === '') {
      this.props.searchQuery.set(value);
    }
  }

  render() {
    return (
      <div>
        <SemanticUiSearch
          placeholder='Type name to search'
          icon='inverted circular search'
          onKeyUp={this.searchVolunteers.bind(this)} 
          ref="search"
        />
      </div>
    );
  }
}