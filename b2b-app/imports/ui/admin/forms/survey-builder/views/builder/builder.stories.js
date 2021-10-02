import React from 'react'
import BuilderView from './builder'
import { useInitRecoil } from '../../hooks'
import { partsAtom, singleAtom } from '../../recoil/atoms'

export default {
  title: 'Survey Builder/Views/Builder',
  component: BuilderView,
  parameters: {
    viewport: {
      defaultViewport: 'iphone6',
    },
  },
}

const Template = (args) => <BuilderView {...args} />

export const Default = Template.bind({})
Default.args = {
  navigationController: { state: { views: [] } },
}

export const Data = Template.bind({})
Data.args = {
  ...Default.args,
}
Data.decorators = [
  (Story) => {
    useInitRecoil(({ set }) => {
      const parts = [
        { _id: 'id1', type: 'single' },
        { _id: 'id2', type: 'single' },
        { _id: 'id3', type: 'single' },
      ]
      set(partsAtom, parts)
      parts.forEach(({ _id }, i) =>
        set(singleAtom(_id), {
          prompt: `Question ${i}`,
          answers: [{ name: `Answer ${i}` }],
        })
      )
    })
    return <Story />
  },
]
