import React from 'react'
import Meeting from './meeting'

// import { date } from '/imports/ui/admin/standup-notes/meeting.js'
// const Meeting = ({ teamName, people = [] }) => {
//   {
//     ;(people.userId = 'mikkel'), (people.name = 'Mike'), (teamName = 'the dream team')
//   }
//   {
//     ;(people.userId = 'pato'), (people.name = 'Pat'), (teamName = 'the dream team')
//   }
// }
// const Template = (args) => <Meeting {...args} />

// export const Standup = Template.bind({})
// Standup.args = {
//   title: 'Meeting title',
// }

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

//const MeetingStory = () => <Meeting people={people} teamName="what ever" />

export default {
  title: 'Standup/Meeting',
  component: Meeting,
  parameters: {
    viewport: {
      // defaultViewport: 'iphone6',
    },
    layout: 'fullscreen',
  },
  decorators: [(Story) => <Story />],
}
export const Standup = () => <Meeting people={people} teamName="The dream team"></Meeting>
