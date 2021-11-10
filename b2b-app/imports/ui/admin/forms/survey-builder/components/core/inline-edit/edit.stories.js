import React from 'react'
import { InlineEdit } from '.'

export default {
  title: 'Survey Builder/Core/Inline Edit',
  component: InlineEdit,
}

const Template = (args) => <InlineEdit {...args} />

export const Default = Template.bind({})
Default.args = {
  placeholder: 'Editable text',
}

export const PrefilledText = Template.bind({})
PrefilledText.args = {
  ...Default.args,
  text: 'Prefilled value',
}

export const LongText = Template.bind({})
LongText.args = {
  ...Default.args,
  text:
    'This is a long editable content component that automatically wraps as it fills the container width.',
}
LongText.decorators = [
  (Story) => (
    <div style={{ width: 500, background: 'lightgrey' }}>
      <p>This outer div container has a max width of 500px</p>
      <Story />
    </div>
  ),
]

export const Tabbing = ({ texts, ...args }) => (
  <div>
    {texts.map((t, i) => (
      <div key={i} style={{ marginBottom: 10 }}>
        <InlineEdit {...args} text={t} />
      </div>
    ))}
  </div>
)
Tabbing.args = {
  ...Default.args,
  texts: ['Label 1', 'Label 2', 'Label 3'],
}
