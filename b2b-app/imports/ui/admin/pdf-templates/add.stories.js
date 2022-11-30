import { action } from '@storybook/addon-actions'
import React from 'react'
import Add from './add'
import { PdfTemplateProvider } from './context'

export default {
  title: 'pdf-template/Add',
  component: { Add },
  argTypes: {
    titlesize: {
      control: 'select',
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    },
    headingsize: {
      control: 'select',
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    },
    alignment: {
      control: 'select',
      options: ['left', 'right', 'center'],
    },
    titlecolor: {
      control: 'color',
    },
    cancelButtoncolor: {
      control: 'color',
    },
    subtitleColor: {
      control: 'select',
      options: ['primary', 'secondary'],
    },
  },
}

const Template = (args) => {
  return (
    <PdfTemplateProvider value={args}>
      <Add {...args} />
    </PdfTemplateProvider>
  )
}

export const Add1 = Template.bind({})

Add1.args = {
  methods: {
    save: action('Saving', 'Saving form'),
    goBack: action('Canceling', 'Go back'),
  },
}
