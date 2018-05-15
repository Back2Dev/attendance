import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { List, Header } from 'semantic-ui-react'
import MemberCardIn from './member-card-in'


class MemberListIn extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visibleStatus: ''
    }
  }

toggleStatus = (id) => {
  this.setState({
    visibleStatus: this.state.visibleStatus == id ? '' : id
  })
}

  render() {
    const { members, title } = this.props

    return (
      <div
        style={{
          position: 'fixed',
          zIndex: '999',
          backgroundColor: 'white',
          bottom: '0',
          left: '0',
          right: '0',
          height: '20vh',
          padding: '0 20px 10px',
          textAlign: 'center'
        }}
      >
        <Header
          as={'h2'}
          content={title}
          dividing
        />

        <List horizontal style={{ margin: '0' }} size={'huge'}>
          {
            members.map(member => (
              <MemberCardIn key={member._id} {...member} toggleStatus={this.toggleStatus} visibleStatus={this.state.visibleStatus}/>
            ))
          }
        </List>
      </div>
    )
  }

}

MemberListIn.propTypes = {
  members: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
};

export default MemberListIn