import PropTypes from 'prop-types'
import React from 'react'
import { Button, Grid, Image, List, Header } from 'semantic-ui-react'
import { expires, humaniseDate, isPast } from '/imports/helpers/dates'

const debug = require('debug')('b2b:admin')

const Dupes = props => {
  const { members, dupes, refresh } = props
  const index = {}
  members.forEach(member => {
    if (!index[member.name]) {
      index[member.name] = [member]
    } else {
      index[member.name].push(member)
    }
  })

  return (
    <Grid columns={4}>
      <Grid.Row key={'000'}>
        <Grid.Column width={6}>
          <Header as="h1" style={{ padding: '8px' }}>
            Duplicates
          </Header>
        </Grid.Column>
        <Grid.Column>
          <Button onClick={refresh}>Refresh</Button>
        </Grid.Column>
      </Grid.Row>
      {dupes.map(dupe => (
        <React.Fragment key={dupe._id}>
          {index[dupe._id] && index[dupe._id].map(member => {
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
                                <span
                                  style={{
                                    color: isPast(member.expiry) ? 'red' : 'black'
                                  }}
                                >
                                  {member.subsType} {expires(member.expiry)}
                                </span>
                                <br />
                                {member.sessionCount} visits
                              </p>
                            </List.Description>
                          </List.Content>
                        </td>
                      </tr>
                    </tbody>
                  </table>{' '}
                </Grid.Column>
                <Grid.Column style={{ textAlign: 'left' }} />
                <Grid.Column style={{ textAlign: 'right' }} width={6}>
                  <List.Content floated="right">
                    <Button
                      color="red"
                      onClick={e => {
                        e.preventDefault()
                        props.removeDupe(member._id, false)
                      }}
                      content="Delete"
                      about={member.name}
                    />
                    &nbsp;
                    <Button
                      color="green"
                      onClick={e => {
                        e.preventDefault()
                        props.removeDupe(member._id, true)
                      }}
                      content="Merge and delete"
                      about={member.name}
                    />
                  </List.Content>
                </Grid.Column>
              </Grid.Row>
            )
          })}
        </React.Fragment>
      ))}
    </Grid>
  )
}

Dupes.propTypes = {
  members: PropTypes.array.isRequired,
  dupes: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  removeDupe: PropTypes.func.isRequired
}

export default Dupes
