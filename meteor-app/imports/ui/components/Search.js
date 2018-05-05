import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

export default class Search extends React.Component{

  search(e){
    let value = this.refs.search.value;
    if(value !== '' && e.keyCode === 13){
      this.props.searchQuery.set(value);
      this.props.searching.set(true);
    }

    if(value === ''){
      this.props.searchQuery.set(value);
    }
  }

  render(){
    return(
      <div>
        <input type="text" name="search" placeholder="Find a volunteer..." onKeyUp={this.search.bind(this)} ref="search"/>
      </div>
    );
  }
}