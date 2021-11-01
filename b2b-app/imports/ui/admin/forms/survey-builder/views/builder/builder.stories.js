import React from 'react'
import { EditorContext } from '../../../framework/framework'
import { BuilderView } from '.'

const context = {
  editors: [
    {
      updateEditor: () => {},
    },
  ],
}

export default {
  title: 'Survey Builder/Views/Builder',
  component: BuilderView,
  decorators: [
    (Story) => (
      <EditorContext.Provider value={context}>
        <Story />
      </EditorContext.Provider>
    ),
  ],
  parameters: { layout: 'fullscreen' },
}

const Template = (args) => <BuilderView {...args} />

export const Default = Template.bind({})

export const LoadValidData = Template.bind({})
LoadValidData.args = {
  json: {
    sections: [
      {
        title: 'Step 1',
        questions: [
          {
            title:
              'Which sport is thought to have developed from the 18th-century English game of rounders?',
            answers: [
              {
                title: 'table tennis',
                id: 'table-tennis',
                type: 'text',
                val: 'wrong',
              },
              {
                title: 'baseball',
                id: 'baseball',
                type: 'text',
                val: 'right',
              },
              {
                title: 'football (soccer)',
                id: 'football',
                type: 'text',
                val: 'wrong',
              },
              {
                title: 'bowling',
                id: 'bowling',
                type: 'text',
                val: 'wrong',
              },
            ],
            grid: [],
            id: 'sport',
            type: 'single',
          },
          {
            title:
              'White Star chairman J. Bruce Ismay was on the Titanic during its maiden voyage and survived its sinking. Why was he publicly shunned afterward?',
            answers: [
              {
                title: 'He threatened to shoot passengers.',
                id: 'shoot-passengers',
                type: 'text',
                val: 'wrong',
              },
              {
                title: 'He ordered third-class gates locked.',
                id: 'lock-third-class-gates',
                type: 'text',
                val: 'wrong',
              },
              {
                title: 'He refused to aid survivors in the ocean.',
                id: 'help-no-survivors',
                type: 'text',
                val: 'wrong',
              },
              {
                title: 'He took a seat in a lifeboat.',
                id: 'boat',
                type: 'text',
                val: 'right',
              },
            ],
            grid: [],
            id: 'titanic',
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
            title: 'Participants',
            columns: [
              {
                title: 'Name',
                id: 'name',
                type: 'text',
                values: ['Bill', 'Wendy'],
              },
              {
                title: 'Mobile',
                id: 'mobile',
                type: 'text',
                values: ['04123456', '04582912'],
              },
            ],
            grid: [],
            id: 'personal-details',
            type: 'datagrid',
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
