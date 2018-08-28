import React from 'react'
import { Component } from 'react'
import { Button, Icon, Modal, Dropdown } from 'semantic-ui-react'
import "/imports/ui/layouts/assessment.css"

class MechanicModal extends Component {
  state = { 
    modalOpen: false,
    mechanic: "",
   } 

  handleOpen = () => this.setState({ modalOpen: true })

  handleClose = () => this.setState({ modalOpen: false })

  handleChange = (e, data) => {
      this.setState({ mechanic: data.value });
  }

  handleSave(job, mechanic) {
    // event.preventDefault()
    Meteor.call("assessment.update", job.jobId, job.status, mechanic)
    //code to save mechanic to db here
    this.handleClose();
  }

  render() {

    const jobId = this.props.currentJob._id
    const mechanic = this.state.mechanic
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
        color="teal"
        onClick={this.handleOpen}>
        <h1>{(this.props.currentJob.mechanic === undefined) ? <Icon name="add user"/> : <Icon name="remove user"/> }</h1>
      </Button>}
      onClose={this.handleClose}
      open={this.state.modalOpen}
      >
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
      <Modal.Actions>
          <Button color='green' onClick={() => this.handleSave(this.props.currentJob, mechanic)} inverted>
            <Icon name='checkmark' /> Add
          </Button>
          <Button color='red' onClick={this.handleClose} inverted>
            <Icon name='times' /> Close
          </Button>
        </Modal.Actions>
    </Modal>

    )
  }
};

export default MechanicModal;