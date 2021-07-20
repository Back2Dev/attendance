import React from 'react'
import FieldGrid from './field-grid'
import RegisterProvider from '../context'
import { Input } from '@material-ui/core'

export default {
  title: 'Admin/Register/Form/Field Grid',
  component: FieldGrid,
  parameters: {
    docs: {
      source: {
        excludeDecorators: true, // don't show decorator code when clicking 'show code' in docs
      },
    },
  },
  argTypes: {
    span: {
      control: false, // disable control but keeps this prop listed in the docs ArgsTable
    },
    container: {
      control: false,
    },
    item: {
      control: false,
    },
    children: {
      control: false,
    },
    fields: {
      description:
        'This is **not a real prop**. Only used in storybook to make configuring children (`FieldGrid` items) easier.',
    },
  },
  decorators: [
    (story) => (
      <RegisterProvider>
        <div
          style={{
            border: '1px solid lightgrey',
            padding: '1rem',
            margin: '3rem auto',
            maxWidth: 600,
          }}
        >
          {story()}
        </div>
      </RegisterProvider>
    ),
  ],
}

const ContainerTemplate = (args) => {
  const { fields, cols } = args
  return (
    <FieldGrid cols={cols} container>
      {fields.map(({ label, span }, i) => (
        <FieldGrid item key={i} span={span}>
          <Input placeholder={label} fullWidth />
        </FieldGrid>
      ))}
    </FieldGrid>
  )
}

export const DefaultItems = ContainerTemplate.bind({})
DefaultItems.args = {
  fields: [{ label: 'Name' }, { label: 'Phone' }],
}

export const MultiSpanItems = ContainerTemplate.bind({})
MultiSpanItems.args = {
  cols: 4,
  fields: [
    { label: 'First Name', span: 2 },
    { label: 'Last Name', span: 2 },
    { label: 'Address', span: 4 },
    { label: 'Suburb', span: 2 },
    { label: 'State', span: 1 },
    { label: 'Postcode', span: 1 },
  ],
}
