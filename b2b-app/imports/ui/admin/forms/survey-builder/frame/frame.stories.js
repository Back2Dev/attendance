import React from 'react'

import { PureFrame } from './frame'
import { Single } from '../types'

export default {
  title: 'Survey Builder/Frame',
  component: PureFrame,
  subcomponent: Single,
}

const MyComponent = () => <div>Question type component goes here</div>

const Template = (args) => <PureFrame {...args} />

export const Default = Template.bind({})
Default.args = {
  children: <MyComponent />,
  selected: false,
}

export const Mobile = Template.bind({})
Mobile.args = {
  ...Default.args,
  mobile: true,
  selected: true,
}

Mobile.parameters = {
  viewport: {
    defaultViewport: 'mobile1',
  },
}
