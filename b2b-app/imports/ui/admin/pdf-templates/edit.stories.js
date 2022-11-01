import React from 'react'
import Edit from './edit'

export default {
  title: 'pdf-template/Edit',
  component: { Edit },
  argTypes: {
    loading: {
      control: 'boolean',
    },
  },
}
const Template = (args) => <Edit {...args} />

export const Edit1 = Template.bind({})

Edit1.args = {
  id: 'item1',
  methods: {
    update: (form) => {
      console.log('updating form', form)
    },
    remove: (id) => {
      console.log('deleting item', id)
    },
    goBack: () => console.log('go back'),
  },
  item: {
    name: 'sample1',
    revision: 1,
    active: true,
  },
  loading: false,
}
export const Edit2 = Template.bind({})

Edit2.args = {
  id: 'item2',
  methods: {
    update: (form) => {
      console.log('updating form', form)
    },
    remove: (id) => {
      console.log('deleting item', id)
    },
    goBack: () => console.log('go back'),
  },
  item: {
    name: 'sample2',
    revision: 2,
    active: false,
  },
  loading: false,
}
