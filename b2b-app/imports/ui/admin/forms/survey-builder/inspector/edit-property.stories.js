import React from 'react'
import { useSetRecoilState } from 'recoil'
import { singleState } from '../types'
import EditProperty from './edit-property'

export default {
  title: 'Survey Builder/Builder/Inspector/Edit Property',
  component: EditProperty,
  decorators: [
    (Story) => {
      const setState = useSetRecoilState(singleState('pid'))
      setState({
        prompt: 'Question text',
        id: 'qid',
        answers: [
          { name: 'choice 1', val: 'c1_val' },
          { name: 'choice 2', val: 'c2_val' },
        ],
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
