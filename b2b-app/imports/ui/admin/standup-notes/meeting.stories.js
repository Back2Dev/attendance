import React from 'react'
import Meeting from './meeting'

import { date } from 'imports/ui/admin/standup-notes/meeting.js'
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
// const Template = (args) => <Meeting {...args} />
// const Meeting = ({ teamName, people = [] }) => {
//   ;(people.userId = 'mikkel'),
//     (people.name = 'Mike'),
//     (teamName = 'the dream team')((people.userId = 'pato')),
//     (people.name = 'Pat'),
//     (teamName = 'the dream team')
// }
// export const Standup = Template.bind({})
// Standup.args = {
//   title: 'Meeting title',
// }

export const Standup = () => (
  <Meeting teamName="The dream team">
    <h1>
      ${teamName} daily standup ${date}
    </h1>
  </Meeting>
)
