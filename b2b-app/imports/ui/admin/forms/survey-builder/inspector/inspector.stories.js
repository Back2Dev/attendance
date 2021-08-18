import React from 'react'
import Inspector from './inspector'

export default {
  title: 'Survey Builder/Inspector',
  component: Inspector,
}

const Template = (args) => <Inspector {...args} />

export const Default = Template.bind({})
