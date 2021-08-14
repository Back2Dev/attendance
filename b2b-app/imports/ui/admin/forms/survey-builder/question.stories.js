import React from 'react'
import Question from './question'

export default {
  title: 'Survey Builder/Question',
  component: Question,
}

const Template = (args) => <Question {...args} />

export const Default = Template.bind({})

export const Placeholder = Template.bind({})
Placeholder.args = {
  placeholder: 'Placholder',
}

export const Label = Template.bind({})
Label.args = {
  label: 'Prefilled label',
}
