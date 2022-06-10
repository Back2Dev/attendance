import React from 'react'
import { Text } from '.'

export default {
  title: 'Survey Builder/Types/Text',
  component: Text,
}

const Template = (args) => <Text {...args} />

export const Default = Template.bind({})
Default.args = {
  pid: 'pid',
  index: 0,
}
