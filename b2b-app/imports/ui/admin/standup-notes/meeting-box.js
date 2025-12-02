import { Meteor } from 'meteor/meteor'
import React from 'react'
import PropTypes from 'prop-types'
import { useNavigate, useParams } from 'react-router-dom'
import { useTracker } from 'meteor/react-meteor-data'
import Teams from '/imports/api/teams/schema'
import { meteorCall } from '/imports/ui/utils/meteor'
import Loader from '/imports/ui/components/commons/loading.js'
import Meeting from './meeting'

const debug = require('debug')('app:viewer')
const idField = '_id'

const MeetingBox = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const { item, loading } = useTracker(() => {
    const subsHandle = Meteor.subscribe('id.teams', id)
    return {
      loading: !subsHandle.ready(),
      item: Teams.findOne(id) || {},
    }
  }, [id])

  const save = async (form) => {
    form.when = new Date()
    await meteorCall('insert.standups', 'saving standup', form)
    navigate('/admin/standups')
  }

  if (loading) return <Loader loading />
  return (
    <Meeting
      teamName={item.name}
      teamId={item._id}
      people={item.devs?.map((dev) => ({ name: dev }))}
      save={save}
      loading={loading}
    />
  )
}

export default MeetingBox
