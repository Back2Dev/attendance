import React from 'react'
import EditProperty from './edit-property'

export default {
  title: 'Survey Builder/Inspector/Edit Property',
  component: EditProperty,
}

const Template = (args) => <EditProperty {...args} />

export const Default = Template.bind({})
Default.args = {
  label: 'label',
}
