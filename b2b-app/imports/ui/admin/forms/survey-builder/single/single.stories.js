import React from 'react'
import Single from '.'

export default {
  title: 'Survey Builder/Single',
  component: Single,
}

const Template = (args) => <Single {...args} />

export const Default = Template.bind({})
Default.args = {}
