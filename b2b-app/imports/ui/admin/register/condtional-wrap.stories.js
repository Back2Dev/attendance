/* eslint-disable */
import React from 'react'
import ConditionalWrap from './conditional-wrap'

const Template = (args) => (
  <ConditionalWrap
    {...args}
    style={{ border: '1px solid lightgrey', padding: '2rem', display: 'inline-block' }}
  >
    <h1>This is the title</h1>
    <p>This is a summary</p>
  </ConditionalWrap>
)

export const Default = Template.bind({})
Default.args = {
  wrapTrue: ({ children, style }) => (
    <a href="#card-details" style={style}>
      {children}
    </a>
  ),
  wrapFalse: ({ children, style }) => <div style={style}>{children}</div>,
}
Default.argTypes = {
  children: {
    control: false,
  },
}
// currently in addon-docs, when clicking 'show code' in story, the function prop shows () => {}
// but I want to show implementation so let's override/hardcode it
Default.parameters = {
  docs: {
    transformSource: (src) => {
      return src
        .replace(
          /wrapTrue={.+}/,
          'wrapTrue={({ children, style }) => <a href="#card-details" style={style}>{children}</a>}'
        )
        .replace(
          /wrapFalse={.+}/,
          'wrapFalse={({ children, style }) => <div style={style}>{children}</div>}'
        )
    },
  },
}

export const TrueCondition = Template.bind({})
TrueCondition.args = {
  ...Default.args,
  condition: true,
}
TrueCondition.argTypes = Default.argTypes
TrueCondition.parameters = Default.parameters
