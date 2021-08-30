import React from 'react'

import Frame from './frame'
import { Single } from './types'

export default {
  title: 'Survey Builder/Frame',
  component: Frame,
  subcomponent: Single,
}

const MyComponent = () => <div>Question type component goes here</div>

const Template = (args) => <Frame {...args} />

export const Default = Template.bind({})
Default.args = {
  children: <MyComponent />,
}

export const Selected = Template.bind({})
Selected.args = {
  ...Default.args,
  selected: true,
}
