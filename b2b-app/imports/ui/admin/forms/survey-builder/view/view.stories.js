import React from 'react'
import Navbar from './navbar'
import View from './view'

export default {
  title: 'Survey Builder/View',
  component: View,
  parameters: {
    viewport: {
      defaultViewport: 'iphone6',
    },
  },
}

const Template = (args) => <View {...args} />

export const Default = Template.bind({})
Default.args = {
  navLeft: <div />,
  children: 'main content',
  navigationController: { state: { views: [] } },
}

export const RootView = Template.bind({})
RootView.args = {
  ...Default.args,
  navRight: <Navbar.Button align="right">Settings</Navbar.Button>,
  navMiddle: 'title',
}

export const ChildView = Template.bind({})
ChildView.args = {
  ...Default.args,
  navLeft: null,
  navRight: <Navbar.Button align="right">Settings</Navbar.Button>,
  navMiddle: 'title',
  navigationController: { state: { views: [] } },
}

export const ChildViewTitle = Template.bind({})
ChildViewTitle.args = {
  ...ChildView.args,
  navRight: <Navbar.Button align="right">Settings</Navbar.Button>,
  navMiddle: 'title',
  backTitle: 'root',
}
