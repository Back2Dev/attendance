import React from 'react'
import SingleInner from './inner'

export default {
  title: 'Survey Builder/Single/Single Inner',
  component: SingleInner,
}

const Template = (args) => <SingleInner {...args} />

export const Default = Template.bind({})

export const InitialLabel = Template.bind({})
InitialLabel.args = {
  initialLabel: 'Label is initialised',
}

export const InitialList = Template.bind({})
InitialList.args = {
  ...InitialLabel.args,
  initialList: ['Choice 1', 'Choice 2'],
}
