import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Image, List } from 'semantic-ui-react'
import { humaniseDate } from '/imports/helpers/dates'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import CartList from './cart-list'
import './admin-member-list.css'

const debug = require('debug')('b2b:admin')

class Admin extends Component {
  constructor(props) {
    super(props)
  }

  memberClick = id => {
    debug(`memberClick(${id})`)
    this.props.history.push(`/userprofiles/${id}`)
  }

  render() {
    const { members, carts } = this.props
    return (
      <List divided verticalAlign="middle">
        {members.map(member => {
          const memberCarts = carts.filter(cart => cart.memberId === member._id)
          return (
            <List.Item key={member._id} style={{ textAlign: 'left', cursor: 'pointer' }}>
              <Image
                avatar
                size="tiny"
                spaced
                src={'/images/avatars/' + member.avatar}
                style={{ border: '3px solid white' }}
                onClick={e => this.memberClick(member._id)}
              />
              <List.Content onClick={e => this.memberClick(member._id)}>
              <List.Header>{member.name}</List.Header>
                <List.Description>
                  <p>
                    {member.isHere ? 'Arrived:' : 'Last Seen'} {humaniseDate(member.lastIn)} ago{' '}
                  </p>
                  <CartList carts={memberCarts}></CartList>
                </List.Description>
                      </List.Content>
              <List.Content floated="right">
                <Button
                  onClick={e => {
                    e.preventDefault()
                    this.props.removeMember(member._id)
                  }}
                  content="Remove"
                  about={member.name}
                />
              </List.Content>
            </List.Item>
          )
        })}
      </List>
    )
  }
}

Admin.propTypes = {
  members: PropTypes.array.isRequired,
  carts: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  removeMember: PropTypes.func.isRequired
}

export default Admin
