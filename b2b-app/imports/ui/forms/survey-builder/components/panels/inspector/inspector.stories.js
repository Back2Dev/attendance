import { useInitRecoil } from '/imports/ui/forms/survey-builder/hooks'
import {
  partsAtom,
  selectedPartAtom,
  singleAtom,
} from '/imports/ui/forms/survey-builder/recoil/atoms'
import React from 'react'
import { Inspector } from './inspector'

export default {
  title: 'Survey Builder/Panels/Inspector',
  component: Inspector,
  decorators: [
    (Story) => {
      useInitRecoil(({ set }) => {
        set(selectedPartAtom, 'part-id') // setup a part id
        set(partsAtom, [{ _id: 'part-id', type: 'single' }]) // link the part id to a question type
        // set up state for the properties to render
        set(singleAtom('part-id'), {
          id: 'part-id',
          answers: [{ name: 'name1', val: 'val1' }],
        })
      })

      return <Story />
    },
  ],
}

const Template = (args) => <Inspector {...args} />
// TODO: Fix inspector story
export const Default = Template.bind({})
