import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import Avatar from './avatar'
import { Button, Segment, Loader, Modal } from 'semantic-ui-react'
import People from '/imports/collections/People'
import { Link } from 'react-router-dom'
import { renderRoutes } from '../../startup/client/routes';

const User = props => {

    return (
      <Segment style={{ marginTop: '7em' }}>
      <h1>User:</h1>
        {JSON.stringify(props.user)}
        <Button>Sign In</Button>
        <Button>Sign Out</Button>
      </Segment>
    )

}

// User.Proptypes = {
//   person: PropTypes.object.isRequired,
//   isCheckedin: PropTypes.bool.isRequired,
//   loading: PropTypes.bool.isRequired,
//   cancel: PropTypes.func.isRequired,
//   checkin: PropTypes.func.isRequired,
// }

export default withRouter(User);

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
