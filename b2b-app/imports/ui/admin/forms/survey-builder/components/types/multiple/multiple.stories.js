import React from 'react'
import { Multiple } from '.'

export default {
  title: 'Survey Builder/Types/Multiple',
  component: Multiple,
}

const Template = (args) => <Multiple {...args} />

export const Default = Template.bind({})
Default.args = {
  pid: 'pid',
  index: 0,
}
