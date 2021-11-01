import React from 'react'
import { Inspector } from './inspector'

export default {
  title: 'Survey Builder/Panels/Inspector',
  component: Inspector,
}

const Template = (args) => <Inspector {...args} />
// TODO: Fix inspector story
export const Default = Template.bind({})
