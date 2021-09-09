import { CellPlugin } from '@react-page/editor' // only use for TS purposes
import React from 'react'

// a react component that wil be used as a custom plugin
const SomeCustomComponent = ({ title }) => {
  return <div>{title}</div>
}

// Creating the custom plugin which takes the the component
const formPlugin = {
  Renderer: ({ data }) => <SomeCustomComponent title={data.title} />,
  id: 'myFirstCellPlugin',
  title: 'My first cell plugin',
  description: 'My first cell plugin just displays a title',
  version: 1,
  controls: {
    type: 'autoform',
    schema: {
      properties: {
        title: {
          type: 'string',
          default: 'someDefaultValue',
        },
      },
      required: ['title'],
    },
  },
}

export default formPlugin
