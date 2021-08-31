export const goodForms = [
  // No section heading
  {
    name: '2 easy questions',
    source: `# My questionnaire
  Q: Personal details
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
        'sections.0.questions.0.prompt': 'Personal details',
        'sections.0.questions.1.id': 'emergency',
        'sections.0.questions.0.answers.0.title': 'Name',
        'sections.0.questions.0.answers.1.type': 'email',
      },
    ],
  },
  // Registration form
  {
    slug: 'b2b.register',
    name: 'Back2bikes registration form',
    expecting: [
      {
        'sections/0/title': "Let's get to know each other",
        'sections/0/questions/0/answers/0/title': 'bikes',
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
  // Invoice
  {
    expecting: [
      {
        'sections/0/title': 'Invoicing',
        'sections/0/questions/0/id': 'customer',
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

export const badForms = [
  // Registration form with some errors
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
  // Registration form with some errors
  {
    expecting: [
      {
        'errs/0/lineno': 3,
        'errs/length': 5,
        'errs/0/error': 'I could not understand',
      },
    ],
    name: 'Answers without a question',
    source: `
    # Error 1
  How old are you?
  # Error 2
  +nothing=1
  # Error 3
  A Under 18
  # Error 4
  A 19 - 20
  # Error 5
  A 21+
  `,
  },
]
