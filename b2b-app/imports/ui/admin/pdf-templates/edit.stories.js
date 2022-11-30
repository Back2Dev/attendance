import React from 'react'
import Edit from './edit'
import { PdfTemplateProvider } from './context'
import { action } from '@storybook/addon-actions'

export default {
  title: 'pdf-template/Edit',
  component: { Edit },
  argTypes: {},
}
const Template = (args) => {
  return (
    <PdfTemplateProvider value={args}>
      <Edit />
    </PdfTemplateProvider>
  )
}

export const Edit1 = Template.bind({})

Edit1.args = {
  methods: {
    update: action('Updating form Data'),
    goBack: action('Cancelling'),
  },
  item: {
    name: 'sample1',
    description: 'sample1',
    revision: 2,
    active: false,
    _id: 'sample1',
  },
}
export const Edit2 = Template.bind({})

Edit2.args = {
  methods: {
    update: action('updating'),
    goBack: action('canceling'),
  },
  item: {
    name: 'sample2',
    description: 'sample2',
    revision: 2,
    active: false,
    _id: 'sample2',
  },
}
