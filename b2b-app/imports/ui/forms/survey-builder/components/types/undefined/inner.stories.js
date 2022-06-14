import React from 'react'
import { useSetRecoilState } from 'recoil'
import { undefinedAtom } from '/imports/ui/forms/survey-builder/recoil/atoms'
import { useQuestion } from '/imports/ui/forms/survey-builder/recoil/hooks'
import { UndefinedInner } from './inner'

export default {
  title: 'Survey Builder/Types/Undefined/Inner',
  component: UndefinedInner,
}

const Template = (args) => <UndefinedInner {...args} />

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
    const setUndefined = useSetRecoilState(undefinedAtom(Default.args.pid))
    setUndefined((prev) => ({ ...prev, answers: [{ name: '1st' }, { name: '2nd' }] }))
    return <Story />
  },
]
