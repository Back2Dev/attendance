import React from 'react'
import { Component } from 'react'
import { Button, Icon, Modal, Dropdown } from 'semantic-ui-react'
import Members from '/imports/api/members/members'
import "/imports/ui/layouts/assessment.css"

class MyModal extends Component {
  
  handleChange = (event) => {
    console.log(event)
  }
  
  render() {

    Meteor.subscribe('all.members')

    const test = [{key: '1', text: 'cat'}, {key: '2', text: 'dog'}]
    
    const members = Members.find().fetch()
    

    return (

    <Modal trigger={
      <Button
        style={{ textAlign: "center", margin: '5px', borderRadius: "5px" }}
        className="ui button"
        color="teal">
        <h1><Icon name="remove user"/></h1>
      </Button>}>
      <Modal.Header>Select a Mechanic</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <p>Please select a mechanic from the list.</p>
          <Dropdown 
            placeholder='Choose a mechanic'
            onChange={this.handleChange}
            search
            selection
            fluid
            options={members.map(key => key.name)}
          />
        </Modal.Description>
      </Modal.Content> 
    </Modal>

    )
  }
};

export default MyModal;