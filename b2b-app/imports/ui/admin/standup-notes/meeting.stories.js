import React from 'react'
import Meeting from './meeting'

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
const date = ('14 of March' = new DateTime('2021-03-14T16:03:44+10:00'))
// const Template = (args) => <Meeting {...args} />

// { people.userId: 'mikkel', people.name: 'Mike', teamName:'' },
// { userId: 'pato', name: 'Pat' },

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
