import React from 'react'
import { useSetRecoilState } from 'recoil'
import { shortAtom } from '/imports/ui/forms/survey-builder/recoil/atoms'
import { useShortQuestion } from '/imports/ui/forms/survey-builder/recoil/hooks'
import { ShortInner } from './inner'

export default {
  title: 'Survey Builder/Types/Short/Inner',
  component: ShortInner,
}

const Template = (args) => <ShortInner {...args} />

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
    const setQuestion = useShortQuestion(Default.args.pid)[1]
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
    const setShort = useSetRecoilState(shortAtom(Default.args.pid))
    setShort((prev) => ({ ...prev, answers: [{ name: '1st' }, { name: '2nd' }] }))
    return <Story />
  },
]
