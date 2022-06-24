import React from 'react'
import { Multi } from '.'

export default {
  title: 'Survey Builder/Types/Multi',
  component: Multi,
}

const Template = (args) => <Multi {...args} />

export const Default = Template.bind({})
Default.args = {
  pid: 'pid',
  index: 0,
}
