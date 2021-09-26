import React from 'react'
import { useSetRecoilState } from 'recoil'
import { singleAtom } from '../../recoil/atoms'
import { useQuestion } from '../../recoil/hooks'
import SingleInner from './inner'

export default {
  title: 'Survey Builder/Types/Single/Inner',
  component: SingleInner,
}

const Template = (args) => <SingleInner {...args} />

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
    const setSingle = useSetRecoilState(singleAtom(Default.args.pid))
    setSingle((prev) => ({ ...prev, answers: [{ name: '1st' }, { name: '2nd' }] }))
    return <Story />
  },
]
