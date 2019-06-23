import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Image, List, Grid } from 'semantic-ui-react'
import { humaniseDate, expires, isPast } from '/imports/helpers/dates'
import CartList from './cart-list'
import PurchaseList from './purchase-list'
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
    const { members, carts, purchases, removeCart } = this.props
    return (
      <Grid columns={4}>
        {members.map(member => {
          const memberCarts = carts.filter(cart => cart.memberId === member._id)
          const memberPurchases = purchases.filter(purchase => purchase.memberId === member._id)
          return (
            <Grid.Row key={member._id}>
              <Grid.Column>
                <table>
                  <tbody>
                    <tr>
                      <td onClick={e => this.memberClick(member._id)} style={{ cursor: 'pointer' }}>
                        <Image
                          avatar
                          size="tiny"
                          spaced
                          src={'/images/avatars/' + member.avatar}
                          style={{ border: '3px solid white' }}
                        />
                      </td>
                      <td>
                        <List.Content onClick={e => this.memberClick(member._id)}>
                          <List.Header>{member.name}</List.Header>
                          <List.Description>
                            <p>
                              {member.isHere ? 'Arrived:' : 'Last Seen'} {humaniseDate(member.lastIn)} ago <br />
                              <span style={{ color: isPast(member.expiry) ? 'red' : 'black' }}>
                                {member.subsType} {expires(member.expiry)}
                              </span>
                            </p>
                          </List.Description>
                        </List.Content>
                      </td>
                    </tr>
                  </tbody>
                </table>{' '}
              </Grid.Column>
              <Grid.Column style={{ textAlign: 'left' }}>
                {memberPurchases.length > 0 && <PurchaseList purchases={memberPurchases} />}
                {memberPurchases.length === 0 && <span>No previous purchases</span>}
              </Grid.Column>
              <Grid.Column style={{ textAlign: 'left' }}>
                <CartList carts={memberCarts} removeCart={removeCart} />
              </Grid.Column>
              <Grid.Column style={{ textAlign: 'right' }}>
                <List.Content floated="right">
                  {memberPurchases.length > 0 && (
                    <Button
                      color="blue"
                      onClick={e => {
                        e.preventDefault()
                        this.props.extendMember(member._id, memberPurchases[0]._id)
                      }}
                      content="Extend"
                      about={member.name}
                    />
                  )}
                  &nbsp;
                  <Button
                    color="red"
                    onClick={e => {
                      e.preventDefault()
                      this.props.removeMember(member._id)
                    }}
                    content="Remove"
                    about={member.name}
                  />
                </List.Content>
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }
}

Admin.propTypes = {
  members: PropTypes.array.isRequired,
  carts: PropTypes.array.isRequired,
  purchases: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  removeMember: PropTypes.func.isRequired,
  extendMember: PropTypes.func.isRequired,
  removeCart: PropTypes.func.isRequired
}

export default Admin
