import React, { useState } from 'react'
import '@react-page/editor/lib/index.css'
import Fab from '@material-ui/core/Fab'
import Tooltip from '@material-ui/core/Tooltip'
import SaveIcon from '@material-ui/icons/Save'
import Editor from '@react-page/editor'
import image from '@react-page/plugins-image'
import slate from '@react-page/plugins-slate'
import styled from 'styled-components'

const cellPlugins = [slate(), image]

const StyledEditor = styled.div`
  .fab-group {
    padding: 16px;
    position: relative;
    flex-flow: column wrap;
    direction: rtl;
    display: flex;
  }
  .fab-button {
    margin: 8px;
  }
`

const PageEditor = () => {
  const [value, setValue] = useState(null)

  return (
    <StyledEditor>
      <Editor cellPlugins={cellPlugins} value={value} onChange={setValue} />
      <div className="fab-group">
        <Tooltip title="Save" placement="left">
          <Fab color="primary" aria-label="save" className="fab-button">
            <SaveIcon size="lg" />
          </Fab>
        </Tooltip>
      </div>
    </StyledEditor>
  )
}

export default PageEditor
