import React from 'react'
import Single from '.'

export default {
  title: 'Survey Builder/Single',
  component: Single,
}

const Template = (args) => <Single {...args} />

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
