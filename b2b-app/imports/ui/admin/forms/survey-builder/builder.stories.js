import React from 'react'
import { EditorContext } from '../framework/framework'
import { PureBuilder } from './builder'

const context = {
  editors: [
    {
      updateEditor: () => {},
    },
  ],
}

export default {
  title: 'Survey Builder/Builder',
  component: PureBuilder,
  decorators: [
    (Story) => (
      <EditorContext.Provider value={context}>
        <Story />
      </EditorContext.Provider>
    ),
  ],
}

const Template = (args) => <PureBuilder {...args} />

export const Default = Template.bind({})

export const LoadValidData = Template.bind({})
LoadValidData.args = {
  json: {
    sections: [
      {
        title: 'Step 1',
        questions: [
          {
            title: 'What do you identify as?',
            answers: [
              {
                title: 'boy',
                id: 'boy',
                type: 'text',
                val: 'male',
              },
              {
                title: 'girl',
                id: 'girl',
                type: 'text',
                val: 'female',
              },
              {
                title: 'non binary',
                id: 'non-binary',
                type: 'text',
                val: 'nb',
              },
              {
                title: 'alien',
                id: 'alien',
                type: 'text',
                val: 'et',
              },
            ],
            grid: [],
            id: 'identity',
            type: 'single',
          },
        ],
        id: 'step-1',
      },
    ],
    name: 'Sample Survey',
    slug: 'sample',
    version: '1',
    active: true,
  },
}

export const LoadInvalidData = Template.bind({})
LoadInvalidData.args = {
  json: {
    steps: [
      {
        name: 'Details',
        questions: [
          {
            prompt: 'What do you identify as?',
            answers: [
              {
                name: 'alien',
                id: 'alien',
                type: 'text',
                val: 'et',
              },
            ],
            grid: [],
            id: 'identity',
            type: 'single',
          },
        ],
        id: 'details',
      },
    ],
    name: 'Sample Survey',
    slug: 'sample',
    version: '1',
    active: true,
  },
}

export const LoadUnknownTypes = Template.bind({})
LoadUnknownTypes.args = {
  json: {
    sections: [
      {
        title: 'Step 1',
        questions: [
          {
            title: 'Personal details',
            answers: [
              {
                title: 'Name',
                id: 'name',
                type: 'text',
              },
              {
                title: 'email',
                id: 'email',
                type: 'email',
              },
            ],
            grid: [],
            id: 'personal-details',
            type: 'text',
          },
        ],
        id: 'step-1',
      },
    ],
    name: 'Sample Survey',
    slug: 'sample',
    version: '1',
    active: true,
  },
}
