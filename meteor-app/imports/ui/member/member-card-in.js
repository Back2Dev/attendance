import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { List, Image } from 'semantic-ui-react'
import { humaniseDate } from '/imports/helpers/dates'

class MemberCardIn extends Component {
  constructor(props) {
    super(props)
    this.state = {
      displayStatus: true
    }
  }
  showStatus = () => {
    this.setState({ displayStatus: !this.state.displayStatus })
  }

  render() {
    return (
      <List.Item
        style={{height: '50px'}}
        onClick={this.showStatus}>
        <Image verticalAlign={'top'} avatar src={"/images/avatars/" + this.props.avatar} />
        {
          this.state.displayStatus &&
          <List.Content verticalAlign={'middle'} style={{
            transition: 'all 1s ease'
          }}>
            <List.Header>
              {this.props.firstname} {this.props.lastname}
            </List.Header>
            <List.Description>
              <p>Arrived: {humaniseDate(this.props.lastIn)} ago </p>
            </List.Description>
          </List.Content>
        }
      </List.Item >
    )
  }

}

MemberCardIn.propTypes = {
  _id: PropTypes.string.isRequired,
  firstname: PropTypes.string.isRequired,
  lastname: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
  isHere: PropTypes.bool.isRequired,
  sessions: PropTypes.array.isRequired,
  lastIn: PropTypes.object,
}

export default MemberCardIn
