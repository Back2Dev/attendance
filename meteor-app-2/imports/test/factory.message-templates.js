import { Factory } from 'meteor/dburles:factory'
import MessageTemplates from '/imports/api/message-templates/schema'
const templates = require('/tests/fixtures/json/message-templates.json')

Factory.define('messageTemplates', MessageTemplates, {
  name: 'A message template',
  slug: 'a-msg-template',
  subject: 'n/a',
  type: 'SMS',
  recipients: ['CUS'],
  body: 'Re: *|address|*, Something exciting is happening',
})

templates.forEach((t) => {
  Factory.define(t.slug, MessageTemplates, t)
})

// Creates message templates for testing
const testTemplates = [
  {
    name: 'A message template',
    slug: 'a-msg-template',
    subject: 'n/a',
    type: 'SMS',
    body: 'Re: *|address|*, Something exciting is happening',
  },
  {
    name: 'A email template',
    slug: 'a-email-template',
    subject: 'test email',
    type: 'EMAIL',
    body:
      'Dear *|conveyancer|*, We have now assigned a customer to your property settlement. *|customer|* has been assigned to *|address|*',
  },

  {
    name: 'App template',
    slug: 'a-app-template',
    subject: 'n/a',
    type: 'APP',
    body: 'this is an app message',
  },
]

Factory.define('testTemplates', MessageTemplates, {})

export const createTestTemplates = () => {
  testTemplates.map((template) => {
    Factory.create('testTemplates', template)
  })
}
