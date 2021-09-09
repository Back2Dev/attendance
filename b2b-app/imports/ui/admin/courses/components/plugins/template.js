import { CellPlugin } from '@react-page/editor' // only use for TS purposes
import React from 'react'
import slate from '@react-page/plugins-slate'

// a react component that wil be used as a custom plugin
const SomeCustomComponent = ({ title }) => {
  return <div>{title}</div>
}

// Creating the custom plugin which takes the the component
const formPlugin = (content) => {
  console.log(content)
  const { title } = content
  return {
    Renderer: ({ data }) => <SomeCustomComponent title={data.title} />,
    id: 'contentTitle',
    title: 'Title',
    description: "Content's title",
    version: 1,
    cellPlugins: [slate],
    controls: {
      type: 'autoform',
      schema: {
        properties: {
          title: {
            type: 'string',
            default: title,
          },
        },
        required: ['title'],
      },
    },
  }
}

export default formPlugin
