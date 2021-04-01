import faker from 'faker'
import { Factory } from 'meteor/dburles:factory'
import { Random } from 'meteor/random'
import CONSTANTS from '/imports/api/constants'
import Messages from '/imports/api/messages/schema'

Factory.define('messages', Messages, {
  subject: "Contents of bottle",
  body: 'Message in a bottle',
  data: {name: 'John Doe', address: "My house, my street"},
  status: 'queued',
  messageNo: 10,
  template: 'Message template',
  type: 'email',
  to: 'sant@the-north-pole.com.arctica',
})
