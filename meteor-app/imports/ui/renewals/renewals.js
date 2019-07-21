import React from 'react'
import PropTypes from 'prop-types'
import { Button, Menu, Checkbox, Tab, Icon } from 'semantic-ui-react'

const debug = require('debug')('b2b:reminders')

const ListMembers = ({ members, type }) => {
  const [expired, setExpired] = React.useState(true)
  const [selected, setSelected] = React.useState({})
  const [all, setAll] = React.useState(false)

  const emailReminder = () => {
    debug('Sending email reminders')
  }

  const selectMember = name => {
    const newSels = selected
    newSels[name] = !newSels[name]
    setSelected(newSels)
    debug('Selected', selected)
  }

  const toggleAll = () => {
    const newSels = selected
    members
      .filter(member => member.subsType === type)
      .filter(member => (expired ? member.status === 'expired' : true))
      .forEach(member => {
        newSels[member.name] = !selected[member.name]
      })
    setSelected(newSels)
    debug('toggleAll', selected)
    setAll(!all)
  }

  return (
    <div>
      <Menu>
        <Menu.Item name="remind" onClick={emailReminder}>
          <Button type="button" color="blue" icon>
            <Icon name="mail" />
            &nbsp;Email Reminder
          </Button>
        </Menu.Item>
        <Menu.Item>
          <Button type="button" color="blue" icon onClick={toggleAll}>
            <Icon name="check" />
            &nbsp;Select all
          </Button>
        </Menu.Item>
        <Menu.Item>
          <Checkbox
            label="Only show expired"
            defaultChecked={expired}
            onClick={() => {
              setSelected({})
              setExpired(!expired)
            }}
          />
        </Menu.Item>
      </Menu>
      {members
        .filter(member => member.subsType === type)
        .filter(member => (expired ? member.status === 'expired' : true))
        .map((member, ix) => (
          <div key={member._id}>
            <Checkbox
              label={`${member.name} ${member.subsType} ${member.status}`}
              value={member.name}
              name={member.name}
              defaultChecked={selected[member.name]}
              onClick={e => {
                e.preventDefault()
                selectMember(member.name)
              }}
            />
          </div>
        ))}
    </div>
  )
}

const Renewals = ({ members, carts, purchases }) => {
  const panes = [
    {
      menuItem: 'Members',
      render: () => (
        <Tab.Pane attached={false}>
          <ListMembers members={members} type="member" />
        </Tab.Pane>
      )
    },
    {
      menuItem: 'Passes',
      render: () => (
        <Tab.Pane attached={false}>
          <ListMembers members={members} type="pass" />
        </Tab.Pane>
      )
    },
    {
      menuItem: 'Casual',
      render: () => (
        <Tab.Pane attached={false}>
          <ListMembers members={members} type="casual" />
        </Tab.Pane>
      )
    }
  ]

  return (
    <div>
      <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
    </div>
  )
}
export default Renewals

Renewals.propTypes = {
  members: PropTypes.array.isRequired,
  carts: PropTypes.array.isRequired,
  purchases: PropTypes.array.isRequired
}
