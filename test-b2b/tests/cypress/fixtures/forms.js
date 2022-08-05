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
    
    A costs input
    +type=text
    +id=number

    `,
    active: true,
    revision: 1,
  },
}
