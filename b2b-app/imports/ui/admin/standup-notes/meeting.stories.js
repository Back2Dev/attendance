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

// const Template = (args) => <Meeting {...args} />

// export const Standup = Template.bind({})
// Standup.args = {
//   title: 'Meeting title',
// }

export const Standup = () => <Meeting title="Meeting title"></Meeting>
