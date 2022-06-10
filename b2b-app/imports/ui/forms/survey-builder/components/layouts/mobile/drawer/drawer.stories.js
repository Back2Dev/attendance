import React from 'react'
import { Drawer } from './drawer'

export default {
  title: 'Survey Builder/Layouts/Mobile/Drawer',
  component: Drawer,
  parameters: {
    viewport: {
      defaultViewport: 'iphone6',
    },
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div>
        Toggle open the drawer with the `open` prop
        <Story />
      </div>
    ),
  ],
}

const Template = (args) => <Drawer {...args} />

export const Default = Template.bind({})
Default.args = {
  title: 'Drawer title',
  children: 'This is the drawer content',
  open: false,
}
