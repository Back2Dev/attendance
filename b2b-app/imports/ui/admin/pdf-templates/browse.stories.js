import React from 'react'
import Browse from './browse'
import { action } from '@storybook/addon-actions'
import { PdfTemplateProvider } from './context'

export default {
  title: 'pdf-template/Browse',
  component: { Browse },
  argTypes: {},
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
  return <Browse {...args} />
}
export const BrowseFiles = Template.bind({})

List1.args = {
  loadingPdfs: false,
  items: items,
  methods: {
    remove: action('Deleting Form'),
    edit: action('Editing Form'),
    insert: action('Adding Form'),
    view: action('Viewing Form'),
    add: action('Navigating to New form: '),
    archive: action('Archiving'),
    goBack: action('Navigating to Previous'),
    update: action('Updating form'),
  },
  items,
  methods,
  columns,
  setSelectedTemplate,
  selectedTemplate,
}
