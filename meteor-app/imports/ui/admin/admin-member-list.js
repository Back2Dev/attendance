import PropTypes from 'prop-types'
import React from 'react'
import { Button, Grid, Image, List, Icon } from 'semantic-ui-react'
import './admin-member-list.css'
import { shorten_name } from '/imports/api/utils'
import CartList from './cart-list'
import PurchaseList from './purchase-list'
import { expires, humaniseDate, isPast } from '/imports/helpers/dates'

const debug = require('debug')('b2b:admin')

const Admin = props => {
  const [showCarts, setCart] = React.useState(false)
  const { members, carts, purchases, removeCart } = props

  const memberClick = id => {
    debug(`memberClick(${id})`)
    props.history.push(`/admin/userprofiles/${id}`)
  }

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
                    <td onClick={e => memberClick(member._id)} style={{ cursor: 'pointer' }} align="center">
                      <Image
                        avatar
                        size="tiny"
                        spaced
                        src={'/images/avatars/' + member.avatar}
                        style={{ border: '3px solid white' }}
                      />
                      {shorten_name(member.name)}&nbsp;
                    </td>
                    <td>
                      <List.Content onClick={e => memberClick(member._id)}>
                        <List.Header>
                          {member.paymentCustId && <Icon color="green" name="credit card outline"></Icon>}
                          {member.wwccOk && (
                            <>
                              &nbsp;<Icon color="green" name="child"></Icon>
                            </>
                          )}
                          {member.isSlsa && (
                            <>
                              &nbsp;
                              <Icon color="green" name="life ring"></Icon>
                            </>
                          )}
                        </List.Header>
                        <List.Description>
                          <p>
                            {member.isHere ? 'Arrived:' : 'Last Seen'} {humaniseDate(member.lastIn)} ago <br />
                            <span
                              style={{
                                color: isPast(member.expiry) ? 'red' : 'black'
                              }}
                            >
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
            {showCarts && (
              <Grid.Column style={{ textAlign: 'left' }}>
                <CartList carts={memberCarts} removeCart={removeCart} />
              </Grid.Column>
            )}
            <Grid.Column style={{ textAlign: 'right' }} width={6}>
              <List.Content floated="right">
                <Button
                  color="blue"
                  onClick={e => {
                    e.preventDefault()
                    // props.extendMember(member._id, memberPurchases[0]._id)
                    props.addProduct(member._id, member.name)
                  }}
                  content="Add..."
                  about={member.name}
                />
                &nbsp;
                {false && (
                  <Button
                    color="green"
                    onClick={e => {
                      e.preventDefault()
                      memberClick(member._id)
                    }}
                    content="Invite..."
                    about={member.name}
                  />
                )}
                &nbsp;
                <Button
                  color="red"
                  onClick={e => {
                    e.preventDefault()
                    props.removeMember(member._id)
                  }}
                  content="Delete"
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

Admin.propTypes = {
  members: PropTypes.array.isRequired,
  carts: PropTypes.array.isRequired,
  purchases: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  removeMember: PropTypes.func.isRequired,
  extendMember: PropTypes.func.isRequired,
  removeCart: PropTypes.func.isRequired,
  addProduct: PropTypes.func.isRequired
}

export default Admin
