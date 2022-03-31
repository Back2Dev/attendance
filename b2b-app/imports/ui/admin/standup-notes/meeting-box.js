import React from 'react'
import Meeting from './meeting'

const people = [
  {
    userId: 'mikkel',
    name: 'Mike',
    teamName: 'the dream team',
  },
  {
    userId: 'pato',
    name: 'Pat',
    teamName: 'the dream team',
  },
]

export default Mtg = () => <Meeting people={people} teamName="The dream team" />
