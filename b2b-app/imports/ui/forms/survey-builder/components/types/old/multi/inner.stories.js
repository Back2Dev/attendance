import React from 'react'
import { useSetRecoilState } from 'recoil'
import { multiAtom } from '/imports/ui/forms/survey-builder/recoil/atoms'
import { useQuestion } from '/imports/ui/forms/survey-builder/recoil/hooks'
import { MultiInner } from './inner'

export default {
  title: 'Survey Builder/Types/Multi/Inner',
  component: MultiInner,
}

const Template = (args) => <MultiInner {...args} />

export const Default = Template.bind({})
Default.args = {
  pid: 'id',
}

export const InitialLabel = Template.bind({})
InitialLabel.args = {
  ...Default.args,
}
InitialLabel.decorators = [
  (Story) => {
    const setQuestion = useQuestion(Default.args.pid)[1]
    setQuestion('This is a question?')
    return <Story />
  },
]

export const InitialList = Template.bind({})
InitialList.args = {
  ...InitialLabel.args,
  initialList: ['Choice 1', 'Choice 2'],
}
InitialList.decorators = [
  (Story) => {
    const setMulti = useSetRecoilState(multiAtom(Default.args.pid))
    setMulti((prev) => ({ ...prev, answers: [{ name: '1st' }, { name: '2nd' }] }))
    return <Story />
  },
]
