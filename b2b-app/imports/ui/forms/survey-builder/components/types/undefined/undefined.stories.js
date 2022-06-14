import React from 'react'
import { Undefined } from '.'

export default {
  title: 'Survey Builder/Types/Undefined',
  component: Undefined,
}

const Template = (args) => <Undefined {...args} />

export const Default = Template.bind({})
Default.args = {
  pid: 'pid',
  index: 0,
}
