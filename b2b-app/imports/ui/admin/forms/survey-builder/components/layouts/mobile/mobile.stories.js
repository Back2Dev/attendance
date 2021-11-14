import React from 'react'
import { MobileLayout } from '.'
import { Navbar } from './navbar'

export default {
  title: 'Survey Builder/layouts/mobile',
  component: MobileLayout,
  parameters: {
    viewport: {
      defaultViewport: 'iphone6',
    },
  },
}

const Template = (args) => <MobileLayout {...args} />

export const Default = Template.bind({})
Default.args = {
  navLeft: <div />,
  children: 'main content',
  navigationController: { state: { views: [] } },
}

export const NavbarItems = Template.bind({})
NavbarItems.args = {
  ...Default.args,
  navRight: <Navbar.Button align="right">Settings</Navbar.Button>,
  navMiddle: 'title',
}

export const BackButton = Template.bind({})
BackButton.args = {
  ...Default.args,
  navLeft: null,
  navRight: <Navbar.Button align="right">Settings</Navbar.Button>,
  navMiddle: 'title',
  navigationController: { state: { views: [] } },
}

export const BackBtnWithTitle = Template.bind({})
BackBtnWithTitle.args = {
  ...BackButton.args,
  navRight: <Navbar.Button align="right">Settings</Navbar.Button>,
  navMiddle: 'title',
  backTitle: 'root',
}
