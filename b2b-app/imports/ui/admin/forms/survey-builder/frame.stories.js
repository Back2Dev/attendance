import React from 'react'

import Frame from './frame'
import Single from './single'

export default {
  title: 'Survey Builder/Frame',
  component: Frame,
  subcomponent: Single,
}

const MyComponent = () => <div>Question component goes here</div>

const Template = (args) => <Frame {...args} />

export const Default = Template.bind({})
Default.args = {
  children: <MyComponent />,
}

export const SingleFrame = Template.bind({})
SingleFrame.args = {
  children: <Single />,
}
SingleFrame.storyName = 'Single'
