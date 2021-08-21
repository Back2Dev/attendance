import React from 'react'
import MyComponent from './index'


export default {
  title: 'MyComponent',
  component: MyComponent,
}

const Template = (args) => <MyComponent {...args} />
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
