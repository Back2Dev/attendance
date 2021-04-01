//import.class.js
// import.container.js
import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { render } from 'react-dom';
// Import routing components
import { Link, Redirect } from 'react-router-dom';

class ImportClass extends Component {
  constructor(props) {
    super(props);

    this.state = {
      saved: false,
    };

    this.save = this.save.bind(this);
    this.importSome = this.importSome.bind(this);
    this.importAll = this.importAll.bind(this);

  }

  importAll(e) {
    e.preventDefault()
    Meteor.call('importAll')
  }

  importSome(e) {
    e.preventDefault()
    Meteor.call('importSome')
  }

  save(e){
    e.preventDefault()
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
      data: this.data.value,
    }
    let ok = true
    _.each(_.keys(importData),key => {
      if (key !== '_id' && !importData[key])
        ok = false
    })
    if (ok) {
      console.log("Saving",importData)
      Meteor.call("importClass",importData)
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
        <div>Data (paste in class json)</div>
        <div><textarea className="numbered" ref={c => (this.data = c)} cols="80" rows="25" name="data"></textarea></div>
        <button className="btn btn-prev btn-primary btn-lg pull-right" onClick={this.save}>Import from text box above</button>
        <br/>
        <hr/>
        <button className="btn btn-prev btn-primary btn-lg pull-right" onClick={this.importSome}>Import from ~triton/trust/semantic/final</button>
        <button className="btn btn-prev btn-primary btn-lg pull-right" onClick={this.importAll}>Delete all and import from ~triton/trust/semantic/final</button>
        <br/>
        <Link className="btn btn-prev btn-secondary btn-lg" to={"/schools"}>Cancel</Link>
      </div>
    )
  }
}

ImportClass.propTypes = {
};

export default ImportClass;

