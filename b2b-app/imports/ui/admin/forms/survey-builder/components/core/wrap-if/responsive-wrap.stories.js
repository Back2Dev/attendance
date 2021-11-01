import { Box } from '@material-ui/core'
import React from 'react'
import { ResponsiveWrap } from '.'

export default {
  title: 'Survey Builder/Core/WrapIf/ResponsiveWrap',
  component: ResponsiveWrap,
}

const Template = (args) => <ResponsiveWrap {...args} />

export const Default = Template.bind({})
Default.args = {
  desktop: <Box color="primary.contrastText" bgcolor="primary.light" />,
  mobile: <Box color="primary.contrastText" bgcolor="secondary.light" />,
  children: (
    <div>
      This content remains the same. See how the wrapping element changes when the window
      width resizes.
    </div>
  ),
}
