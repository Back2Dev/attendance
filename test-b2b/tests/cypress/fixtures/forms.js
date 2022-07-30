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
}
