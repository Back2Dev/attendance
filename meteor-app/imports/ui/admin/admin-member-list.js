import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Image, List } from "semantic-ui-react";
class Admin extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { members } = this.props
    return (
      <List textAlign='left' divided verticalAlign='middle'>
        {
          members.map(member => (
            <List.Item 
            style={{ textAlign: 'left' }}
            key={member._id}>
              <Image avatar spaced src={"/images/avatars/" + member.avatar} style={{ border: '3px solid white' }} />
              <List.Content floated='right'>
                <Button
                  onClick={() => this.props.removeMember(member._id)}
                  content='Remove'
                />
              </List.Content>
              <List.Content
                as='span'
                
              >
                {member.name}
              </List.Content>
            </List.Item>
          ))
        }
      </List>
    )
  }
}

Admin.propTypes = {
  members: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  removeMember: PropTypes.func.isRequired,
};

export default Admin

// MemberList.propTypes = {
//   Component: PropTypes.func.isRequired,
//   Loader: PropTypes.func.isRequired,
//   onCardClick: PropTypes.func.isRequired,
//   members: PropTypes.array,
//   title: PropTypes.string,
// };