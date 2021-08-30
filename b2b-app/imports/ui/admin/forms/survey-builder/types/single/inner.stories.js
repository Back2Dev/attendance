import React from 'react'
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
  initialLabel: 'Label is initialised',
}

export const InitialList = Template.bind({})
InitialList.args = {
  ...InitialLabel.args,
  initialList: ['Choice 1', 'Choice 2'],
}
