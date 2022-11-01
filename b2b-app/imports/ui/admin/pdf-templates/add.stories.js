import React from 'react'
import Add from './add'

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

const Template = (args) => <Add {...args} />

export const Add1 = Template.bind({})

Add1.args = {
  loading: false,
  methods: {
    save: (form) => {
      console.log('form', form)
    },
    goBack: () => {
      console.log('going back')
    },
  },
  item: {},
}
