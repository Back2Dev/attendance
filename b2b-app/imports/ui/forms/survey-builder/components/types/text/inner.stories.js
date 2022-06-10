import React from 'react'
import { useSetRecoilState } from 'recoil'
import { textAtom } from '/imports/ui/forms/survey-builder/recoil/atoms'
import { useTextQuestion } from '/imports/ui/forms/survey-builder/recoil/hooks'
import { TextInner } from './inner'

export default {
  title: 'Survey Builder/Types/Text/Inner',
  component: TextInner,
}

const Template = (args) => <TextInner {...args} />

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
    const setQuestion = useTextQuestion(Default.args.pid)[1]
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
    const setText = useSetRecoilState(textAtom(Default.args.pid))
    setText((prev) => ({ ...prev, answers: [{ name: '1st' }, { name: '2nd' }] }))
    return <Story />
  },
]
