import React from 'react'
import { DropZone } from "./item"

export default { title: "Survey Builder/Types/upload", component: DropZone }

const Template = ( args ) => {
  return <DropZone {...args} />
}

export const Default = Template.bind({})

Default.args={pid:"pid", index:0}
export const Upload = Template.bind({})

Upload.args = {...Default.args, pid:5}