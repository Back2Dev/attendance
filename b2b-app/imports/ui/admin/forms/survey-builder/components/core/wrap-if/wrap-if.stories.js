import { Box } from '@material-ui/core'
import React from 'react'
import { WrapIf } from '.'

export default {
  title: 'Survey Builder/Core/WrapIf',
  component: WrapIf,
}

const Template = (args) => <WrapIf {...args} />

export const Default = Template.bind({})
Default.args = {
  condition: true,
  wrapTrue: <Box color="primary.contrastText" bgcolor="primary.light" />,
  wrapFalse: <Box color="primary.contrastText" bgcolor="secondary.light" />,
  children: (
    <div>
      This content remains the same. See how the wrapping element changes according to the
      `condition` prop
    </div>
  ),
}
