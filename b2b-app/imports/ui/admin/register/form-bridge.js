import SimpleSchema from 'simpl-schema'
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2'

SimpleSchema.setDefaultMessages({
  messages: {
    en: {
      badPin: 'PIN must be 4 digits only',
      pinMismatch: 'PINs do not match',
      refuseTerms: 'You must accept the terms in order to create a new account',
    },
  },
})

const aboutFormSchema = new SimpleSchema({
  bikesHousehold: {
    type: SimpleSchema.Integer,
    min: 0,
    optional: true,
    label: 'Number of bikes you own',
    custom() {
      if (this.value > 0 && !this.field('primaryBike').value) {
        this.addValidationErrors([{ name: 'primaryBike', type: 'required' }])
        return false
      }
    },
  },
  primaryBike: {
    type: String,
    optional: true,
    allowedValues: [
      'Road/racer',
      'Hybrid',
      'Mountain',
      'Cruiser',
      'Ladies',
      'Gents',
      'Fixie/Single Speed',
    ],
    label: 'Main bike',
    custom() {
      if (this.value && !this.field('bikesHousehold').value) {
        this.addValidationErrors([{ name: 'bikesHousehold', type: 'required' }])
        return false
      }
    },
  },
  workStatus: {
    type: String,
    label: 'Employment status',
    optional: true,
    allowedValues: [
      'Full Time',
      'Part Time',
      'Pension/Disability',
      'Unemployed',
      'Student',
      'Retired',
    ],
  },
  reasons: {
    type: String,
    optional: true,
    label: 'Volunteer reasons',
    uniforms: {
      multiline: true,
      placeholder:
        'What makes you want to to volunteer at Back2Bikes?\nHave you ever done any other volunteering before?\nHave you worked on bikes or something similar before?',
      rows: 6,
    },
  },
})

const contactFormSchema = new SimpleSchema({
  name: String,
  email: String,
  mobile: {
    type: String,
    label: 'Mobile number',
  },
  phone: {
    type: String,
    optional: true,
    label: 'Phone number',
  },
  pin: {
    type: String,
    custom: function () {
      if (!/\d{4}/.test(this.value)) {
        return 'badPin'
      }
    },
    label: 'PIN number',
    uniforms: {
      placeholder: 'Must be 4 digits',
    },
  },
  pinConfirm: {
    type: String,
    custom: function () {
      if (this.field('pin').value !== this.value) {
        return 'pinMismatch'
      }
    },
    label: 'Confirm PIN',
  },
  addressStreet: {
    type: String,
    optional: true,
    label: 'Address',
  },
  addressSuburb: {
    type: String,
    optional: true,
    label: 'Suburb',
  },
  addressState: {
    type: String,
    allowedValues: ['VIC', 'NSW', 'SA', 'QLD', 'NT', 'WA', 'TAS'],
    optional: true,
    label: 'State',
  },
  addressPostcode: {
    type: String,
    optional: true,
    label: 'Postcode',
  },
})

const emergencyFormSchema = new SimpleSchema({
  emergencyContact: {
    type: String,
    label: 'Emergency contact name',
  },
  emergencyPhone: {
    type: String,
    label: 'Emergency contact number',
  },
  emergencyEmail: {
    type: String,
    optional: true,
    label: 'Emergency contact email',
  },
})

const avatarFormSchema = new SimpleSchema({
  avatar: {
    type: String,
    defaultValue: 'default.jpg',
    allowedValues: [
      'default.jpg',
      '1.jpg',
      '2.jpg',
      '3.jpg',
      '4.jpg',
      '5.jpg',
      '6.jpg',
      '7.jpg',
      '8.jpg',
      '9.jpg',
      '10.jpg',
      '11.jpg',
      '12.jpg',
      '13.jpg',
      '14.jpg',
      '15.jpg',
      '16.jpg',
      'test11.png',
      'test14.png',
      'test16.png',
      'test17.png',
      'test18.png',
      'test19.png',
      'test20.png',
      'test21.png',
      'test24.png',
      'test25.png',
      'test26.png',
      'test28.png',
      'test29.png',
    ],
  },
})

const termsFormSchema = new SimpleSchema({
  privacy: {
    type: Boolean,
    defaultValue: false,
    custom() {
      return !this.value && 'refuseTerms'
    },
    uniforms: {
      label: 'I accept the terms',
      color: 'primary',
    },
  },
})

const aboutBridge = new SimpleSchema2Bridge(aboutFormSchema)
const contactBridge = new SimpleSchema2Bridge(contactFormSchema)
const emergencyBridge = new SimpleSchema2Bridge(emergencyFormSchema)
const avatarBridge = new SimpleSchema2Bridge(avatarFormSchema)
const termsBridge = new SimpleSchema2Bridge(termsFormSchema)

export { aboutBridge, contactBridge, emergencyBridge, avatarBridge, termsBridge }
