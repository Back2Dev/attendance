import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import React from 'react'
import { useHistory } from 'react-router-dom'
import Triggers from '/imports/api/triggers/schema'
import MessageTemplates from '/imports/api/message-templates/schema'
import { meteorCall } from '/imports/ui/utils/meteor'
import { obj2Search } from '/imports/api/util'
import TriggersList from './list'
import config from './config'

const debug = require('debug')('app:lister')

const remove = async (id) => await meteorCall('rm.triggers', 'Deleting', id)
const update = async (form) => await meteorCall('update.triggers', 'updating', form)
const insert = async (form) => await meteorCall('insert.triggers', 'adding', form)

const deleteRows = (selected) => {
  if (selected.length === 0) alert('Please select one or more items to delete')
  selected.forEach(async (id) => await methods.remove(id))
}
const saveMessage = async (form, oldSlug) => {
  await meteorCall('update.messageTemplates', 'updating', form)
}

const methods = { remove, update, insert, deleteRows, saveMessage }

const TriggersWrapper = (props) => {
  if (props.loading) return <div>Loading...</div>
  return <TriggersList {...props}></TriggersList>
}

const TriggersLister = withTracker((props) => {
  const subsHandle = Meteor.subscribe('all.triggers')
  const items = Triggers.find({}).map((row) => {
    row.search = obj2Search(row)
    return row
  })
  const messageTemplates = MessageTemplates.find({}).fetch()

  const { defaultObject } = config.add
  return {
    items,
    methods,
    defaultObject,
    loading: !subsHandle.ready(),
    messageTemplates,
  }
})(TriggersWrapper)

export default TriggersLister
