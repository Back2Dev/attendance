import React from 'react'
import { useSetRecoilState } from 'recoil'
import { singleState } from '../single/single'
import EditProperty from './edit-property'

export default {
  title: 'Survey Builder/Inspector/Edit Property',
  component: EditProperty,
  decorators: [
    (Story) => {
      const setState = useSetRecoilState(singleState(0))
      setState({
        question: { label: 'Question', '+id': 'qid' },
        answers: [
          { label: 'choice 1', '+val': 'c1_val' },
          { label: 'choice 2', '+val': 'c2_val' },
        ],
      })
      return <Story />
    },
  ],
}

const Template = (args) => <EditProperty {...args} />

export const StringPath = Template.bind({})
StringPath.args = {
  id: 0,
  path: 'question.label',
}

export const ArrayPath = Template.bind({})
ArrayPath.args = {
  id: 0,
  path: 'answers',
}

export const ObjectPath = Template.bind({})
ObjectPath.args = {
  id: 0,
  path: 'question',
}
