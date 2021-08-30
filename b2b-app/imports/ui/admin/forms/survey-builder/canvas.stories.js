import React from 'react'

import Canvas, { partsState } from './canvas'
import useListControls, { makeNewItem } from './hooks/list-controls'

export default {
  title: 'Survey Builder/Builder/Canvas',
  component: Canvas,
  decorators: [
    (Story) => {
      const { add } = useListControls(partsState)
      return (
        <div>
          <section>
            <h1>Toolbar</h1>
            <button
              onClick={() => {
                add(makeNewItem({ type: 'single' }))
              }}
            >
              Add Single
            </button>
          </section>

          <section>
            <h2>Canvas</h2>
            <Story />
          </section>
        </div>
      )
    },
  ],
}

const Template = (args) => <Canvas {...args} />

export const Default = Template.bind({})
