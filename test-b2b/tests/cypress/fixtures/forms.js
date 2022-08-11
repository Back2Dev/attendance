module.exports = {
  multiple: {
    slug: 'test-multiple',
    name: 'Test Multiple',
    source: `
    S Part 1
    +id=part1
    
    Q Which sports do you play?
    +type=multiple
    +id=play
    +optional=1
    A Golf
    A Soccer
    A Tennis
    A Footy
    A Squash
    A Croquet
    A Lawn bowls
    A Trugo
    A Curling
#    A Skiing

    S Part 2
    +id=part2

    Q Which sports do you watch?
    +type=multiple
    +id=watch
    // +optional=1
    A Golf
    A Soccer
    A Tennis
    A Footy
    A Squash
    A Croquet
    A Lawn bowls
    A Trugo
    A Curling
    A Skiing
    `,
    active: true,
    revision: 1,
  },
  signature: {
    slug: 'test-signature',
    name: 'Test Signature',
    source: `
    S Part 1
    +id=part1
    
    Q Please sign here
    +type=signature

    `,
    active: true,
    revision: 1,
  },
  address: {
    slug: 'test-address',
    name: 'Test Address',
    source: `
    S Part 1
    +id=part1
    
    Q Enter your address
    +type=text
    A Your Residential Address
    +type=address
    +id=residential

    `,
    active: true,
    revision: 1,
  },
  single: {
    slug: 'test-single',
    name: 'Test Single',
    source: `
    S Part 1
    +id=part1
    
    Q Select a practice
    +type=single
    A vic
    A nsw
    A wa
    +type=single
    +id=single

    `,
    active: true,
    revision: 1,
  },
  date: {
    slug: 'test-date',
    name: 'Test date',
    source: `
    S Part 1
    +id=part1
    
    Q Enter date
    +type=text
    A Date
    +type=date
    

    `,
    active: true,
    revision: 1,
  },
  dropdown: {
    slug: 'test-dropdown',
    name: 'Test dropdown',
    source: `
    S Part 1
    +id=part1
    
    Q dropdown
    +type=dropdown
    
    A value-1
    +type=dropdown
    +id=dropdown

    `,
    active: true,
    revision: 1,
  },
  number: {
    slug: 'test-number',
    name: 'Test number',
    source: `
    S Part 1
    +id=part1
    
    Q enter costs
    +type=text
    
    A value-1
    +type=text
    +id=costs

    `,
    active: true,
    revision: 1,
  },
  long: {
    slug: 'test-long',
    name: 'Test long',
    source: `
    S Part 1
    +id=part1
    
    Q enter adornment cost
    +type=text
    
    A please enter adorment cost
    +type=long
    +id=long

    `,
    active: true,
    revision: 1,
  },

  password: {
    slug: 'test-password',
    name: 'Test Password',
    source: `
    S Part 1
    +id=part1
    
    Q Enter your password
    +type=text
    A Your Password
    +type=password
    +id=password

    `,
    active: true,
    revision: 1,
  },
  paragraph: {
    slug: 'test-paragraph',
    name: 'Test paragraph',
    source: `
    S Part 1
    +id=part1
    
    Q Enter a paragraph
    +type=text
    A Your paragraph
    +type=paragraph
    +id=paragraph

    `,
    active: true,
    revision: 1,
  },
  text: {
    slug: 'test-text',
    name: 'Test text',
    source: `
    S Part 1
    +id=part1
    
    Q Enter conveyancer name
    +type=text
    A conveyancers name
    +type=text
    +id=text

    `,
    active: true,
    revision: 1,
  },
}
