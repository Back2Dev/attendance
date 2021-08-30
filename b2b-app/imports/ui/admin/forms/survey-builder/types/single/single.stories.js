import React from 'react'
import Single from './single'

export default {
  title: 'Survey Builder/Types/Single',
  component: Single,
}

const Template = (args) => <Single {...args} />

export const Default = Template.bind({})
Default.args = {
  pid: 'pid',
}
