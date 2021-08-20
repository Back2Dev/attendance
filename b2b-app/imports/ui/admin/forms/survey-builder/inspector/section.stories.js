import React from 'react'
import Section from './section'

export default {
  title: 'Survey Builder/Inspector/Section',
  component: Section,
}

const Template = (args) => <Section {...args} />

export const Default = Template.bind({})
Default.args = {
  heading: 'Section heading',
}
