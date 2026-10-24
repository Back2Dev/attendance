import faker from 'faker'
import { Factory } from 'meteor/dburles:factory'
import { Random } from 'meteor/random'
import CONSTANTS from '/imports/api/constants'
import Registrations from '/imports/api/registrations/schema'

Factory.define('registrations', Registrations, {
  name: () => faker.name.findName(),
  email: () => faker.internet.email(),
  mobileNumber: '0412345678',
  pinNumber: '1234',
  emergencyContactName: () => faker.name.findName(),
  emergencyContactMobile: '0498765432',
})
