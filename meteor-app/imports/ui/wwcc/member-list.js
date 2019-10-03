import PropTypes from 'prop-types'
import React from 'react'
import { Button, Grid, Image, List } from 'semantic-ui-react'
import './member-list.css'
import WwccModal from '/imports/ui/wwcc/wwcc-modal'
import { dateOnly, humaniseDate, isPast } from '/imports/helpers/dates'

const debug = require('debug')('b2b:admin')

const Admin = props => {
  const { members } = props

  const memberClick = id => {
    debug(`memberClick(${id})`)
    props.history.push(`/wwcc/${id}`)
  }

  return (
    <Grid columns={4}>
      {members.map(member => {
        const wwccOk = member.wwccOk // && !isPast(member.wwccExpiry)
        const wwccColor = wwccOk ? 'green' : 'red'
        return (
          <Grid.Row key={member._id}>
            <Grid.Column width={8}>
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
                        <List.Header style={{ color: wwccOk ? 'green' : 'red' }}>{member.name}</List.Header>
                        <List.Description>
                          <p>
                            {member.isHere ? 'Arrived:' : 'Last Seen'} {humaniseDate(member.lastIn)} ago <br />
                            <span
                              style={{
                                color: wwccOk ? 'green' : 'red'
                              }}
                            >
                              {member.wwcc ? `${member.wwcc} ${member.wwccSurname || ''}` : ` WWCC NOT SUPPLIED`}
                              {member.wwccExpiry ? `, expires: ${dateOnly(member.wwccExpiry)}` : ''}
                            </span>
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
                &nbsp;
                {member.wwcc && (
                  <Button
                    color={wwccColor}
                    inverted
                    onClick={e => {
                      e.preventDefault()
                      props.checkWwcc(member._id, member.wwcc, member.name)
                    }}
                    content="Check"
                    about={member.name}
                  />
                )}
                <WwccModal {...props} member={member} />
                <div style={{ color: 'red' }}>&nbsp;{member.wwccError}</div>
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
  loading: PropTypes.bool.isRequired,
  checkWwcc: PropTypes.func.isRequired
}

export default Admin
