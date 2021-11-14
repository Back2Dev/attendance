import React from 'react'

import { useParts } from '$sb/recoil/hooks'
import { Canvas } from './canvas'
import { Box } from '@material-ui/core'

export default {
  title: 'Survey Builder/Panels/Canvas',
  component: Canvas,
}

const Template = (args) => {
  const { addPart } = useParts()
  return (
    <div>
      <Box border={1} mb={2}>
        <h1>Toolbar</h1>
        <button
          onClick={() => {
            addPart('single')
          }}
        >
          Add Single
        </button>
        <button
          onClick={() => {
            addPart('short')
          }}
        >
          Add Short Text
        </button>
      </Box>

      <h2>Canvas 👇</h2>
      <Box border={1}>
        <Canvas {...args} />
      </Box>
    </div>
  )
}

export const Default = Template.bind({})
