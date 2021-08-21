import { Meteor } from 'meteor/meteor'
import { expect } from 'chai'
import { parse } from './engine'
import { accessByPath } from '/imports/api/util'
import Factory from '/imports/test/factories'

const debug = require('debug')('app:forms:engine')

const goodForms = [
  {
    name: '2 easy questions',
    source: `# My questionnaire
  T: Personal details
    +id=personal
    +type=short
    A= Name
    A Email
      +type=email
    A Mobile
      +type=mobile
  Q Emergency contact
  +id=emergency
    A= Name
    A Email
      +type=email
    A Mobile
      +type=mobile
  `,
    expecting: [
      {
        'steps.0.questions.0.prompt': 'Personal details',
        'steps.0.questions.0.answers.0.name': 'Name',
      },
    ],
  },
  {
    slug: 'b2b.register',
    name: 'Back2bikes registration form',
    expecting: [
      {
        'steps/0/name': "Let's get to know each other",
        'steps/0/questions/0/answers/0/name': 'bikes',
      },
    ],
    source: `S: Let's get to know each other
    +h3: No need to register if you are already signing in on the computer
    +id: aboutVolunteer
    
    Q: How many bikes are there in your household?
    +id: bikes
    +type: num
    +optional
    A bikes
    
    Q: What type of bike do you ride the most
    +id: bikeType
    +type: dropdown
    +optional
    A: Road bike
    A: Hybrid
    A: Mountain bike
    A: Cruiser
    A: Ladies
    A: Fixie
    A: Gents
    
    Q: Work status
    +id: workStatus
    +type: dropdown
    +optional
    A: Full time
    A: Part time
    A: Pension/Disability
    A: Unemployed
    A: Student
    A: Retired
    
    Q: Reasons for volunteering
    +id: reasons
    +type: long
    +optional
    A: Some good starting points
    +placeholder: What makes you want to volunteer at Back2Bikes? BR Have you ever done volunteering before? BR Have you worked on bikes or something similar before?
    
    S: Contact details
    +id: contact
    
    Q: Full name
    +type: short
    
    A: Email
    +type: email
    
    Q: Address
    +type: address
    
    Q: Mobile
    +type: mobile
    
    Q: Pin number
    +type: password
    +id: pin
    +regex: {\d}4
    +placeholder: 4 digits long
    
    S: Emergency contact
    +id: emergency
    
    Q: Who can we contact in an emergency?
    +type: short
    +id: name
    
    A: Emergency contact email
    +type: email
    +optional
    
    A: Mobile
    +type: mobile
    
    S: Choose your avatar
    
    Q Please Choose an avatar
    +type: avatar
    +id: avatar
    A Avatar
    
    S: Terms and conditions
    
    Q: I consent to Back2Bikes storing the information I have provided above. I understand that Back2Bikes will not disclose the above information without my express consent other than for reasons related to my engagement as a volunteer
    +id terms
    +type=multi
    A Agree
    `,
  },
  {
    expecting: [
      {
        'steps/0/name': 'Invoicing',
        'steps/0/questions/0/id': 'customer',
      },
    ],
    slug: 'invoice',
    name: 'Simple invoice',
    source: `S: Invoicing
      +id: invoice
      
      Q: Customer details
      +id: customer
      +type: short
      
      A: Name
      A: Email
      +type: email
      
      A: Note (optional)
      +type: long
      +optional
      
      # ADD A GRID HERE
      
      Q: Parts  
        G: Description
      +type: short
      
      G: Quantity
      +type: num
      
      G: Unit price
      +type: num
      +id: price`,
  },
]

const badForms = [
  {
    expecting: [
      {
        'errs/0/lineno': 2,
        'errs/0/error': 'I could not understand',
      },
    ],
    name: 'No questions at all',
    source: `
  How old are you?
  Under 18
  19 - 20
  21+
  `,
  },
]

describe('Test forms functions', () => {
  describe('Good forms', () => {
    goodForms.map((form, ix) => {
      it(`Form ${ix + 1}: ${form.name}`, () => {
        let result
        expect(() => {
          result = parse(form.source)
          debug(result)
        }).not.to.throw()
        // debug(JSON.stringify(result, null, 2))
        // expect(result.object.questions[0].prompt).to.be.equal('Personal  details')
        expect(result).to.have.property('status').which.equal('success')
        form.expecting?.forEach((item) => {
          Object.keys(item).forEach((key) => {
            const value = item[key]
            const got = accessByPath(result.survey, key)
            // debug(`Looking for ${key}, value: ${value}, got: ${got}`)
            expect(got).to.be.equal(value)
          })
        })
      })
    })
  })

  describe('Bad forms', () => {
    badForms.map((form, ix) => {
      it(`Form ${ix + 1}: ${form.name}`, () => {
        let result
        expect(() => {
          result = parse(form.source)
          debug(result)
        }).not.to.throw()
        // debug(result)
        expect(result).to.have.property('status').which.equal('failed')
        form.expecting?.forEach((item) => {
          Object.keys(item).forEach((key) => {
            const value = item[key]
            const got = accessByPath(result, key)
            // debug(`Looking for ${key}, value: ${value}, got: ${got}`)
            expect(got).to.be.equal(value)
          })
        })
      })
    })
  })
})
