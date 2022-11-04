import React from 'react'
import View from './view'

export default {
  title: 'pdf-template/View',
  component: { View },
}

const Template = (args) => {
  return <View {...args} />
}
export const View1 = Template.bind({})

View1.args = {
  sbitem: {
    _id: 'item1',
    name: 'item1',
    revision: 1,
    description: 'item1',
    source: 'source1',
    active: true,
  },
}
