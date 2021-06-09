import React, { useState } from 'react'
import styled from 'styled-components'

import { Typography } from '@material-ui/core'

import InlineEdit from '/imports/ui/components/commons/inline-edit/input'

const StyledInlineEditTest = styled.div``

function InlineEditTest() {
  const [text, setText] = useState('Some text to edit')
  return (
    <StyledInlineEditTest>
      <Typography variant="h2">Inline Edit Test</Typography>
      <div>
        <InlineEdit text={text} onSetText={(v) => setText(v)} />
      </div>
    </StyledInlineEditTest>
  )
}

export default InlineEditTest
