import React from 'react'
import TextField from './textbox'

export default {
  title: 'Survey Builder/Types/Short/TextField',
  component: TextField,
}

const Template = (args) => <TextField {...args} />
// props = {value: 'e.target.value'}
// {
//   <TextField {...props} />
// }

export const Default = Template.bind({})
Default.args = {
  title: 'test',
}
