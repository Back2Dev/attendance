import React from 'react'
import { useRecoilState } from 'recoil'

import Canvas, { partsAtom } from './canvas'

export default {
  title: 'Survey Builder/Canvas',
  component: Canvas,
  decorators: [
    (Story) => {
      const [parts, setParts] = useRecoilState(partsAtom)
      return (
        <div>
          <section>
            <h1>Toolbar</h1>
            <button onClick={() => setParts([...parts, parts.length])}>Add Single</button>
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
