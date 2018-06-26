import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Image, List } from "semantic-ui-react";
import { humaniseDate } from '/imports/helpers/dates'
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import './admin-member-list.css';

class Admin extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { members } = this.props
    return (
      <List divided verticalAlign='middle'>
        <TransitionGroup className="list" component={null}>
          {
            members.map(member => (
              <CSSTransition
                key={member._id}
                timeout={500}
                classNames="fade"
              >
                <List.Item
                  style={{ textAlign: 'left' }}
                >
                  <Image avatar size='tiny' spaced src={"/images/avatars/" + member.avatar} style={{ border: '3px solid white' }} />
                  <List.Content>
                    <List.Header>
                      {member.name}
                    </List.Header>
                    <List.Description>
                      <p>{member.isHere ? 'Arrived:' : 'Last Seen'} {humaniseDate(member.lastIn)} ago </p>
                    </List.Description>
                  </List.Content>
                  <List.Content floated='right'>
                    <Button
                      onClick={() => this.props.removeMember(member._id)}
                      content='Remove'
                    />
                  </List.Content>
                </List.Item>
              </CSSTransition>
            ))
          }
        </TransitionGroup>
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
