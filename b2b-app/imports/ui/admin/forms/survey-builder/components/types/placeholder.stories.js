import React from 'react'

import { Placeholder } from '.'
import { dataCache } from '$sb/data-cache'

export default {
  title: 'Survey Builder/Types/Placeholder',
  component: Placeholder,
}

const Template = (args) => <Placeholder {...args} />

export const Default = Template.bind({})
Default.args = {
  pid: 'id123',
  index: 0,
}

Default.decorators = [
  (Story) => {
    dataCache.set({
      sections: [
        {
          questions: [
            {
              id: 'id123',
              type: 'short',
              title: 'question',
              answer: 'answer',
            },
          ],
        },
      ],
    })
    return <Story />
  },
]
