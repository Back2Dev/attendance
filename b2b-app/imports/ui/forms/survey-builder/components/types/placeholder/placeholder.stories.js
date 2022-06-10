import React from 'react'

import { Placeholder } from './placeholder'
import { dataCache } from '/imports/ui/forms/survey-builder/data-cache'

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
