import React from 'react'
import Edit from './edit'
import PdfTemplateProvider from './context'

export default {
  title: 'pdf-template/Edit',
  component: { Edit },
  argTypes: {
    loading: {
      control: 'boolean',
    },
  },
}
const Template = (args) => {
  return (
    <PdfTemplateProvider {...args}>
      <Edit />
    </PdfTemplateProvider>
  )
}

export const Edit1 = Template.bind({})

Edit1.args = {
  sbmethods: {
    update: (model) => {
      console.log('story updated')
    },
    goBack: () => {
      console.log('go back')
    },
  },
  sbitem: {
    name: 'sample1',
    description: 'sample1',
    revision: 2,
    active: false,
    _id: 'sample1',
  },
}
export const Edit2 = Template.bind({})

Edit2.args = {
  sbmethods: {
    update: (model) => {
      console.log('story updated')
    },
    goBack: () => {
      console.log('go back')
    },
  },
  sbitem: {
    name: 'sample2',
    description: 'sample2',
    revision: 2,
    active: false,
    _id: 'sample2',
  },
}
