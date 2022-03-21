import React from 'react'

import addmember from './add-member'

export default {
  title: 'Add Member',
  component: addmember,
  parameters: {
    viewport: {
      // defaultViewport:  'iphone6',
    },
    layout: 'fullscreen',
  },
  decorators: [(Story) => <Story />],
}
