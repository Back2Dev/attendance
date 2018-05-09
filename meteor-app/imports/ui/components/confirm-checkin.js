import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import Avatar from './avatar'
import { Button, Segment, Loader, Modal } from 'semantic-ui-react'
import People from '/imports/collections/People'
import { Link } from 'react-router-dom'

const ConfirmCheckin = (props) => {
  const person = People.findOne({ "_id": props.match.params.id })
  return (
    <Modal open>
      <h1>Id of selected user: {props.match.params.id}</h1>
      <Button as={Link} to="/people">Close</Button>
    </Modal>
  );
}

export default withRouter(ConfirmCheckin);

        // <Modal
        //   isOpen={this.state.modalIsOpen}
        //   onRequestClose={this.closeModal}
        //   style={customStyles}
        //   contentLabel="WTF"
        // >
        //   <div>
        //     <Header
        //       divided
        //       as='h2'
        //       content='Checkin'
        //       textAlign='center'
        //     />
        //     <Avatar
        //       _id={this.state._id}
        //       firstName={this.state.name}
        //       lastName={this.state.surname}
        //       isCheckedIn={isCheckedIn}
        //       fileName={this.state.avatar}
        //     />
        //     <Segment padded='very'>
        //       <Header divided as='h3' content='How long will you be here for?' />
        //       <Slider
        //         min={1}
        //         max={6}
        //         step={1}
        //         marks={marks}
        //         defaultValue={this.state.hours}
        //         onChange={this.handleInput}
        //         dots
        //       />
        //     </Segment>
        //     <div>
        //       <Button onClick={this.closeModal}>
        //         Not Me!
        //       </Button>
        //       <Button
        //         color='green'
        //         onClick={() => this.clickConfirm(this.state._id, this.state.hours)}
        //       >
        //         Sign In
        //       </Button>
        //     </div>
        //   </div>
        // </Modal>
