import React from 'react'
import { DesktopLayout } from './desktop'

export default {
  title: 'Survey Builder/layouts/desktop',
  component: DesktopLayout,
}

const Template = (args) => <DesktopLayout {...args} />

export const Default = Template.bind({})
Default.args = {
  toolbar: 'Toolbar content',
  left: 'Left content',
  center: 'Center content',
  right: 'Right content',
}
