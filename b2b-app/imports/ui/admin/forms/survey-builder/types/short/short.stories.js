import React from 'react'
import ShortText from './short'

export default {
  title: 'Survey Builder/Types/Short',
  component: ShortText,
}

const Template = (args) => <ShortText {...args} />

export const Default = Template.bind({})
Default.args = {
  title: 'test',
  onClick: () => action('clicked'),
}

export const SomeOtherState = Template.bind({})
SomeOtherState.args = {
  //... different args
}
