import React from 'react'
import { Short } from '.'

export default {
  title: 'Survey Builder/Types/Short',
  component: Short,
}

const Template = (args) => <Short {...args} />

export const Default = Template.bind({})
Default.args = {
  pid: 'pid',
  index: 0,
}
