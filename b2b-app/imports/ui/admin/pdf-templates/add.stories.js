import React from 'react'
import Add from './add'
import { PdfTemplateProvider } from './context'

export default {
  title: 'pdf-template/Add',
  component: { Add },
  argTypes: {
    loading: {
      control: 'boolean',
    },
  },
}

const Template = (args) => {
  return (
    <PdfTemplateProvider value={args}>
      <Add />
    </PdfTemplateProvider>
  )
}

export const Add1 = Template.bind({})

Add1.args = {
  methods: {
    save: (form) => {
      console.log('form', form)
    },
    goBack: () => {
      console.log('going back')
    },
  },
}
