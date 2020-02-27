import React from 'react'
import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'

const MembersPortal = () => {
  return <div>{Meteor.userId()}</div>
}

export default MembersPortal
