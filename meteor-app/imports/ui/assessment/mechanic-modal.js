import React from 'react'
import { Component } from 'react'
import { Button, Icon, Modal, Dropdown } from 'semantic-ui-react'
import "/imports/ui/layouts/assessment.css"

class MechanicModal extends Component {

  handleChange = (event) => {
    console.log(event)
  }
  
  render() {
    const members = this.props.members.map(member => {
      return {
        key: member._id,
        value: member.name,
        text: member.name
      }
    })
    
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
            options={members}
          />
        </Modal.Description>
      </Modal.Content> 
    </Modal>

    )
  }
};

export default MechanicModal;