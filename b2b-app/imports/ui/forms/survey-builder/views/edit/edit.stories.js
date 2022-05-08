import React from 'react'
import { TypeRegistry } from 'imports/ui/forms/survey-builder/components/types/type-registry'
import { EditView } from './edit'
import { useInitRecoil } from '../../hooks'
import { partsAtom, singleAtom } from '../../recoil/atoms'

export default {
  title: 'Survey Builder/Views/Edit',
  component: EditView,
  parameters: {
    viewport: {
      defaultViewport: 'iphone6',
    },
  },
  decorators: [
    (Story) => {
      useInitRecoil(({ set }) => {
        const parts = [
          { _id: 'id1', config: TypeRegistry.get('single') },
          { _id: 'id2', config: TypeRegistry.get('single') },
          { _id: 'id3', config: TypeRegistry.get('single') },
        ]
        set(partsAtom, parts)
        parts.forEach(({ _id }, i) => set(singleAtom(_id), { prompt: `Question ${i}` }))
      })
      return <Story />
    },
  ],
}

const Template = (args) => <EditView {...args} />

export const Default = Template.bind({})
Default.args = {
  navigationController: { state: { views: [] } },
  navLeft: <div />,
}
