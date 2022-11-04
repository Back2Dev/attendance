import React from 'react'
import Add from './add'

const sbmethods = {
  save: (form) => {
    console.log('form', form)
  },
  goBack: () => {
    console.log('going back')
  },
}

export default {
  title: 'pdf-template/Add',
  component: { Add },
  argTypes: {
    loading: {
      control: 'boolean',
    },
  },
  parameters: {
    actions: {
      argTypesRegex: '^methods.*',
    },
  },
}

const Template = (args) => {
  return <Add {...args} />
}

export const Add1 = Template.bind({})

Add1.args = { sbmethods: sbmethods }
