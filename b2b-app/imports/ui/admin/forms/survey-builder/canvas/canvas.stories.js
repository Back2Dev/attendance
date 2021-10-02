import React from 'react'

import Canvas from './canvas'
import { useParts } from '../recoil/hooks'

export default {
  title: 'Survey Builder/Builder/Canvas',
  component: Canvas,
}

const Template = (args) => {
  const { addPart } = useParts()
  return (
    <div>
      <section>
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
      </section>

      <section>
        <h2>Canvas</h2>
        <Canvas {...args} />
      </section>
    </div>
  )
}

export const Default = Template.bind({})
