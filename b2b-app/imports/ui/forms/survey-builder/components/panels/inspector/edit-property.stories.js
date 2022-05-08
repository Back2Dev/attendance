import React from 'react'
import {
  partsAtom,
  selectedPartAtom,
  singleAtom,
} from '/imports/ui/forms/survey-builder/recoil/atoms'
import { EditProperty } from './edit-property'
import { useInitRecoil } from '/imports/ui/forms/survey-builder/hooks'

export default {
  title: 'Survey Builder/Panels/Inspector/Edit Property',
  component: EditProperty,
  decorators: [
    (Story) => {
      useInitRecoil(({ set }) => {
        set(selectedPartAtom, 'pid')
        set(partsAtom, [{ _id: 'pid', type: 'single' }])
        set(singleAtom('part-id'), {
          prompt: 'Question text',
          id: 'qid',
          answers: [
            { name: 'choice 1', val: 'c1_val' },
            { name: 'choice 2', val: 'c2_val' },
          ],
        })
      })
      return <Story />
    },
  ],
}

const Template = (args) => <EditProperty {...args} />

export const StringPath = Template.bind({})
StringPath.args = {
  pid: 'pid',
  path: 'prompt',
}

export const ObjectPath = Template.bind({})
ObjectPath.args = {
  ...StringPath.args,
  path: 'answers[0]',
}

export const ArrayPath = Template.bind({})
ArrayPath.args = {
  ...StringPath.args,
  path: 'answers',
}
