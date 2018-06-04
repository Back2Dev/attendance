import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MemberList from "/imports/ui/member/member-list";
import MemberCardSmall from "/imports/ui/member/member-card-small";
import MemberCardSmallLoading from "/imports/ui/member/member-card-small-loading";
import { Grid, Button, List } from "semantic-ui-react";
class Admin extends Component {
  constructor(props) {
    super(props)
  }

  renderList(members) {
    return (
      <List divided verticalAlign='middle'>
        {
          members.map(member => (
            <List.Item key={member._id}>
              <List.Content floated='right'>
                <Button
                  onClick={() => this.props.removeMember(member._id)}
                  content='Remove'
                />
              </List.Content>
              <List.Content>{member.name}</List.Content>
            </List.Item>
          ))
        }
      </List>
    )
  }

  render() {
    const { members } = this.props
    return (
      <Grid centered>
        <Grid.Column width={12}>
          <h1>Admin</h1>
          {
            this.renderList(members)
          }
        </Grid.Column>
      </Grid>
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