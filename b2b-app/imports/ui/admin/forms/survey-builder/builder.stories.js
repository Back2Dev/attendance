import React from 'react'
import Builder from './builder'

export default {
  title: 'Survey Builder/Builder',
  component: Builder,
}

const Template = (args) => <Builder {...args} />

export const Default = Template.bind({})
