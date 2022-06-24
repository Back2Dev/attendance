import React from 'react'
import { useSetRecoilState } from 'recoil'
import { multipleAtom } from '$sb/recoil/atoms'
import { useQuestion } from '$sb/recoil/hooks'
import { MultipleInner } from './inner'

export default {
  title: 'Survey Builder/Types/Multiple/Inner',
  component: MultipleInner,
}

const Template = (args) => <MultipleInner {...args} />

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
    const setMultiple = useSetRecoilState(multipleAtom(Default.args.pid))
    setMultiple((prev) => ({ ...prev, answers: [{ name: '1st' }, { name: '2nd' }] }))
    return <Story />
  },
]
