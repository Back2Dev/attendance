import faker from 'faker'
import { Factory } from 'meteor/dburles:factory'
import { Random } from 'meteor/random'
import CONSTANTS from '/imports/api/constants'
import Forms from '/imports/api/forms/schema'

Factory.define('forms', Forms, {})

Factory.define('forms.b2b.register', Forms, {
  slug: 'b2b.register',
  name: 'Back2bikes registration form',
  source: `S: Let's get to know each other
+h3: No need to register if you are already signing in on the computer
+id: aboutVolunteer

Q: How many bikes are there in your household
+id: householdBikes
+type: num
+optional

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
+placeholder: What makes you want to volunteer at Back2Bikes? \n Have you ever done volunteering before? \n Have you worked on bikes or something similar before?

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
type=multi
A Agree
`,
})

Factory.define('forms.invoice', Forms, {
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
  
  ADD A GRID HERE
  
  Q: Parts  
    G: Description
  +type: short
  
  G: Quantity
  +type: num
  
  G: Unit price
  +type: num
  +id: price`,
})
