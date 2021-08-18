import React from 'react'

import Canvas from './canvas'
import useListControls from './hooks/list-controls'

export default {
  title: 'Survey Builder/Canvas',
  component: Canvas,
  decorators: [
    (Story) => {
      const { add } = useListControls('parts')
      return (
        <div>
          <section>
            <h1>Toolbar</h1>
            <button
              onClick={() => {
                add('')
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
