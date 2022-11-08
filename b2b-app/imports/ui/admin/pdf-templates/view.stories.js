import React from 'react'
import View from './view'
import { PdfTemplateProvider } from './context'

export default {
  title: 'pdf-template/View',
  component: { View },
}

const Template = (args) => {
  return (
    <PdfTemplateProvider value={args}>
      <View />
    </PdfTemplateProvider>
  )
}
export const View1 = Template.bind({})

View1.args = {
  item: {
    _id: 'item1',
    name: 'item1',
    revision: 1,
    description: 'item1',
    source: 'source1',
    active: true,
  },
}
