import React from 'react'
import Buttons from './actionButtons'

export default {
  title: 'Survey Builder/Types/Short/Buttons',
  component: Buttons,
}

const Template = (args) => <Buttons {...args} />
// props = { title: 'cat', thing: 2 }
{
  /* <MyCOmponent {...props} />  === <MyComponent title="cat" thing={2} /> */
}

export const Default = Template.bind({})
Default.args = {
  title: 'test',
  onClick: () => action('clicked'),
}

export const SomeOtherState = Template.bind({})
SomeOtherState.args = {
  //... different args
}
