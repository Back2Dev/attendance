import React from 'react'
import List from './list'
import PdfTemplateProvider, { PdfTemplateConsumer } from './context'
import { actions } from '@storybook/addon-actions'

const args = {
  sbLoadingPdfs: false,
  sbitems: items,
  sbmethods: {
    remove: (id) => console.log('removing item: ', id),
    edit: (form) => console.log('updating form: ', form),
    insert: (form) => console.log('inserting item: ', form),
    view: (id) => console.log('viewing form id: ', id),
    add: (form) => console.log('adding form: ', form),
    archive: (rowids) => console.log('archiving forms from: ', rowids),
    goBack: () => console.log('go back'),
  },
}

export default {
  title: 'pdf-template/List',
  component: { List },
  // argTypes: {
  // sbmethods: {
  //   remove: {
  //     type: actions,
  //   },
  //   edit: {
  //     type: actions,
  //   },
  //   insert: {
  //     type: actions,
  //   },
  //   view: {
  //     type: actions,
  //   },
  //   add: {
  //     type: actions,
  //   },
  //   archive: {
  //     type: actions,
  //   },
  //   goBack: {
  //     type: actions,
  //   },
  // },
  // },
  // },
  decorators: [
    (Story) => {
      return (
        <PdfTemplateConsumer>
          <Story />
        </PdfTemplateConsumer>
      )
    },
  ],
}

const items = [
  {
    _id: 'item1',
    name: 'item1',
    revision: 1,
    description: 'item1',
    source: 'source1',
    active: true,
  },
  {
    _id: 'item2',
    name: 'item2',
    revision: 1,
    description: 'item2',
    source: 'source2',
    active: false,
  },
  {
    _id: 'item3',
    name: 'item3',
    revision: 1,
    description: 'item3',
    source: 'source3',
    active: true,
  },
  {
    _id: 'item4',
    name: 'item4',
    revision: 1,
    description: 'item4',
    source: 'source4',
    active: false,
  },
  {
    _id: 'item5',
    name: 'item5',
    revision: 1,
    description: 'item5',
    source: 'source5',
    active: true,
  },
]
const Template = (args) => {
  return (
    <PdfTemplateProvider {...args}>
      <List />
    </PdfTemplateProvider>
  )
}
export const List1 = Template.bind({})

List1.args = {
  sbLoadingPdfs: false,
  sbitems: items,
  sbmethods: {
    remove: (id) => console.log('removing item: ', id),
    edit: (form) => console.log('updating form: ', form),
    insert: (form) => console.log('inserting item: ', form),
    view: (id) => console.log('viewing form id: ', id),
    add: (form) => console.log('adding form: ', form),
    archive: (rowids) => console.log('archiving forms from: ', rowids),
    goBack: () => console.log('go back'),
  },
}
