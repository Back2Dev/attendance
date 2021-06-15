import SimpleSchema from 'simpl-schema'
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2'

const aboutFormSchema = new SimpleSchema(
  {
    numBikes: {
      type: SimpleSchema.Integer,
      min: 0,
      label: 'How many bikes are in your household?',
    },
    preferedBike: {
      type: String,
      label: 'What type of bike do you ride the most?',
      allowedValues: [
        'Moutain',
        'Road/Racer',
        'Hybrid',
        'BMX',
        'Ladies',
        'Gents',
        'Vintage',
        'Cruiser',
        'Fixie/Single Speed',
      ],
    },
    workStatus: {
      type: String,
      allowedValues: [
        'Full Time',
        'Part Time',
        'Pension/Disability',
        'Unemployed',
        'Student',
        'Retired',
      ],
    },
    volunteerReasons: {
      type: String,
      max: 250,
      label: 'Reasons for volunteering',
    },
  },
  { requiredByDefault: false }
)

const contactFormSchema = new SimpleSchema({
  name: String,
  email: SimpleSchema.RegEx.Email,
  streetAddress: {
    type: String,
    optional: true,
  },
  suburb: {
    type: String,
    optional: true,
  },
  state: {
    type: String,
    allowedValues: ['VIC', 'NSW', 'QLD', 'ACT', 'NT', 'WA', 'SA', 'TAS'],
    optional: true,
  },
  postcode: {
    type: String,
    min: 4,
    max: 4,
    optional: true,
  },
  mobileNumber: SimpleSchema.RegEx.Phone,
  pinNumber: {
    type: String,
    min: 4,
    max: 4,
  },
  confirmPIN: {
    type: String,
    custom() {
      if (this.value !== this.field('pinNumber').value) {
        return 'pinMismatch'
      }
    },
  },
})

const emergencyFormSchema = new SimpleSchema({
  emergencyContactName: String,
  emergencyContactEmail: {
    type: String,
    optional: true,
  },
  emergencyContactMobile: SimpleSchema.RegEx.Phone,
})

const termsFormSchema = new SimpleSchema({
  agree: {
    type: Boolean,
    label:
      'I consent to Back2Bikes storing the information I have provided above. I understand that Back2Bikes will not disclose \
      the above information without my express consent other than for reasons related to my engagement as a volunteer.',
    allowedValues: [true],
  },
})

const contactFormBridge = new SimpleSchema2Bridge(contactFormSchema)
const aboutFormBridge = new SimpleSchema2Bridge(aboutFormSchema)
const emergencyFormBridge = new SimpleSchema2Bridge(emergencyFormSchema)
const termsFormBridge = new SimpleSchema2Bridge(termsFormSchema)

export { contactFormBridge, aboutFormBridge, emergencyFormBridge, termsFormBridge }
