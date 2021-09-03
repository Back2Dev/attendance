import React from 'react'
import { PureBuilder } from './builder'

export default {
  title: 'Survey Builder/Builder',
  component: PureBuilder,
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
                name: 'boy',
                id: 'boy',
                type: 'text',
                val: 'male',
              },
              {
                name: 'girl',
                id: 'girl',
                type: 'text',
                val: 'female',
              },
              {
                name: 'non binary',
                id: 'non-binary',
                type: 'text',
                val: 'nb',
              },
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
        name: 'Getting to know you',
        questions: [
          {
            prompt: 'Personal details',
            answers: [
              {
                name: 'Name',
                id: 'name',
                type: 'text',
              },
              {
                name: 'email',
                id: 'email',
                type: 'email',
              },
            ],
            grid: [],
            id: 'personal-details',
            type: 'text',
          },
          {
            prompt: 'Which sports do you like to watch?',
            answers: [
              {
                name: 'Rugby',
                id: 'rugby',
                type: 'text',
              },
              {
                name: 'Footy',
                id: 'footy',
                type: 'text',
              },
              {
                name: 'Tennis',
                id: 'tennis',
                type: 'text',
              },
              {
                name: 'Golf',
                id: 'golf',
                type: 'text',
                note: 'Not sure if golf is really a sport',
              },
              {
                name: 'Other sport',
                id: 'other-sport',
                type: 'text',
                specify: 'Specify other sport',
              },
            ],
            grid: [],
            id: 'which-sports-do-you-like-to-watch-',
            type: 'multi',
          },
        ],
        id: 'getting-to-know-you',
      },
    ],
    name: 'Sample Survey',
    slug: 'sample',
    version: '1',
    active: true,
  },
}
