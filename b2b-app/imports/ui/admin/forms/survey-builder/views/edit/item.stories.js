import React from 'react'
import { useInitRecoil } from '../../hooks'
import { singleAtom } from '../../recoil/atoms'
import { EditItem } from './item'

export default {
  title: 'Survey Builder/Views/Edit/Content/Item',
  component: EditItem,
  parameters: {
    viewport: {
      defaultViewport: 'iphone6',
    },
  },
  decorators: [
    (Story) => {
      useInitRecoil(({ set }) => {
        set(singleAtom('id1'), {
          prompt:
            'In “The Wolf and the Seven Little Kids,” six young goats are eaten by the big bad villain. How does the story end?',
        })
      })
      return <Story />
    },
  ],
}

const Template = (args) => <EditItem {...args} />

export const Default = Template.bind({})
Default.args = {
  type: 'single',
  index: 0,
  pid: 'id1',
}
