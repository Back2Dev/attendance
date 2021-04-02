// import.container.js
import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { render } from 'react-dom';
// Import routing components
import { Link, Redirect } from 'react-router-dom';

class Importer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      saved: false,
    };

    this.save = this.save.bind(this);
  }

  save(e){
    e.preventDefault();
// 
// Validate the following inputs
//   - slug
//   - yearno
//   - termno
//   - password

//
// Call the back end to do the work
//
    let c =  {};
    let importData = {
      slug: this.slug.value,
      data: this.data.value,
    }
    let ok = true
    _.each(_.keys(importData),key => {
      if (key !== '_id' && !importData[key])
        ok = false
    })
    if (ok) {
      console.log("Saving",importData)
      Meteor.call("importData",importData)
      this.setState({saved: true})
      return true
    } else {
      alert("All input fields are required")
      return false
    }
  }

  render(){

    return (
      <div className="container">
        <h3 className="form__fieldset-title margin-an form__fieldset-title--break">Import Heroku data:</h3>
        <div>School Slug</div>
        <div><input ref={c => (this.slug = c)} type="text" name="slug" defaultValue=""/></div>
        <div>Data (paste in Heroku json)</div>
        <div><textarea className="numbered" ref={c => (this.data = c)} cols="132" rows="50" name="data"></textarea></div>
        <Link className="btn btn-prev btn-secondary btn-lg" to={"/schools"}>Cancel</Link>
        <button className="btn btn-prev btn-primary btn-lg pull-right" onClick={this.save}>Save</button>
      </div>
    )
  }
}

Importer.propTypes = {
};

export default Importer;

