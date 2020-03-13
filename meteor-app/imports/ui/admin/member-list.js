import PropTypes from 'prop-types'
import React from 'react'
import { Button, Grid, Image, List } from 'semantic-ui-react'
import './admin-member-list.css'
import CartList from './cart-list'
import PurchaseList from './purchase-list'
import { exportData } from '/imports/ui/utils/exporter'
import { getExportMap } from '/imports/ui/config/member-add-schemas'
import { expires, humaniseDate, isPast } from '/imports/helpers/dates'

const debug = require('debug')('b2b:admin')

const Admin = props => {
  const { members, carts, purchases, removeCart, orgid, getAllSessions } = props

  const memberClick = id => {
    debug(`memberClick(${id})`)
    props.history.push(`/admin/userprofiles/${id}`)
  }

  const exportNames = () => {
    exportData(members, `${orgid}-names`, getExportMap(orgid))
  }

  const sessionsMap = {}
  const mix = {}
  members.forEach(m => (mix[m._id] = m.name))
  'member name timeIn timeOut duration createdAt'.split(/\s+/).forEach(key => (sessionsMap[key] = key))

  const exportSessions = async () => {
    const ss = await getAllSessions()
    const sessions = ss.map(s => {
      return { member: mix[s.memberId], ...s }
    })
    exportData(sessions, `${orgid}-sessions`, sessionsMap)
  }

  return (
    <Grid columns={4}>
      <Button type="button" onClick={exportNames}>
        Export names
      </Button>
      &nbsp;
      <Button type="button" onClick={exportSessions}>
        Export sessions
      </Button>
      &nbsp;
      {members.map(member => {
        const memberCarts = carts.filter(cart => cart.memberId === member._id)
        const memberPurchases = purchases.filter(purchase => purchase.memberId === member._id)
        return (
          <Grid.Row key={member._id}>
            <Grid.Column>
              <table>
                <tbody>
                  <tr>
                    <td onClick={e => memberClick(member._id)} style={{ cursor: 'pointer' }}>
                      <Image
                        avatar
                        size="tiny"
                        spaced
                        src={'/images/avatars/' + member.avatar}
                        style={{ border: '3px solid white' }}
                      />
                    </td>
                    <td>
                      <List.Content onClick={e => memberClick(member._id)}>
                        <List.Header>{member.name}</List.Header>
                        <List.Description>
                          <p>
                            {member.isHere ? 'Arrived:' : 'Last Seen'} {humaniseDate(member.lastIn)} ago <br />
                          </p>
                        </List.Description>
                      </List.Content>
                    </td>
                  </tr>
                </tbody>
              </table>{' '}
            </Grid.Column>
            <Grid.Column style={{ textAlign: 'right' }} width={6}>
              <List.Content floated="right">
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
  removeCart: PropTypes.func.isRequired
}

export default Admin
