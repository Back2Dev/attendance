import React from 'react'
import { Button, TextField, Typography } from '@material-ui/core'

import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import { useHistory } from 'react-router-dom'
import Teams from '/imports/api/teams/schema'
import { meteorCall } from '/imports/ui/utils/meteor'
import { obj2Search } from '/imports/api/util'
import Eye from '@material-ui/icons/Visibility'
import PencilSquare from '@material-ui/icons/Edit'
import Loader from '/imports/ui/components/commons/loading.js'
//import TeamsList from './list'
import config from './config'

const debug = require('debug')('app:lister')
let push

// Config data

const TeamsList = ({ items }) => {
  return items.map((item) => (
    <div key={item._id}>
      <Typography>
        Team name: {item.name} {item.devs.join()}
      </Typography>
    </div>
  ))
}

const TeamsList2 = ({ items }) => {
  const start = (id) => {
    push(`/admin/standups/meet/${id}`)
  }
  const edit = (id) => {
    push(`/admin/teams/edit/${id}`)
  }
  const getTableContent = (items) => {
    const iterateItem = (devs) => {
      return devs.map(function (dev, j) {
        return (
          <tr key={j}>
            <td>{dev}</td>
          </tr>
        )
      })
    }
    return items.map(function (item, i) {
      return (
        <table key={item._id}>
          <thead>
            <tr>
              <th>{item.name}</th>
              <th>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() => start(item._id)}
                >
                  Start standup
                </Button>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() => edit(item._id)}
                >
                  Edit team
                </Button>
              </th>
            </tr>
          </thead>
          <tbody>{iterateItem(item.devs)}</tbody>
        </table>
      )
    })
  }

  return <div>{getTableContent(items)}</div>
}
const TeamsWrapper = (props) => {
  push = useHistory()?.push
  if (props.loading) return <Loader loading />
  return <TeamsList2 {...props}></TeamsList2>
}

const TeamsLister = withTracker((props) => {
  const subsHandle = Meteor.subscribe('all.teams')
  const items = Teams.find({}).map((row) => {
    row.search = obj2Search(row)
    return row
  })
  return {
    items,
    loading: !subsHandle.ready(),
  }
})(TeamsWrapper)

export default TeamsLister
