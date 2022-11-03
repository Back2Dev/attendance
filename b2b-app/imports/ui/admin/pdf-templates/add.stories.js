import React from 'react'
import Add from './add'
import { PdfTemplateConsumer, PdfTemplateProvider } from './context'

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
  decorators: [
    (Story) => {
      return (
        <PdfTemplateProvider value={{ methods: sbmethods }}>
          <Story />
        </PdfTemplateProvider>
      )
    },
  ],
}

const Template = (args) => {
  return (
    <PdfTemplateConsumer>
      <Add />
    </PdfTemplateConsumer>
  )
}

export const Add1 = Template.bind({})

Add1.args = {}
