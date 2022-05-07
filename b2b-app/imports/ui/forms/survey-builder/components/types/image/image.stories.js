import React from 'react'
import { InnerImage } from "./inner"

export default { title: "Survey Builder/Types/image", component: InnerImage }

const Template = ( args ) => {
  return <InnerImage {...args} />
}

export const Default = Template.bind({})

Default.args={pid:"pid", index:0}
export const Avatars = Template.bind({})

Avatars.args = {...Default.args, images:[{id:"0",img:"images/avatars/1.jpg"},{id:"1",img:"images/avatars/2.jpg"},{id:"2",img:"images/avatars/3.jpg"}]}