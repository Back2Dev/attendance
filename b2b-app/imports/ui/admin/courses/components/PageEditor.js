import React, { useState, useMemo } from 'react'
import '@react-page/editor/lib/index.css'
import Fab from '@material-ui/core/Fab'
import Tooltip from '@material-ui/core/Tooltip'
import Container from '@material-ui/core/Container'
import SaveIcon from '@material-ui/icons/Save'
import Editor from '@react-page/editor'
import image from '@react-page/plugins-image'
import slate from '@react-page/plugins-slate'
import styled from 'styled-components'
import formPlugin from './plugins/template'

const cellPlugins = [slate(), image, formPlugin]

const StyledEditor = styled.div`
  .react-page-controls-mode-toggle-control-group {
    position: fixed !important;
    bottom: 72px !important;
    right: 0 !important;
  }
  .fab-group-container {
    position: fixed;
    z-index: 10001;
    bottom: 0px;
    right: 0px;
    display: flex;
    max-height: 100%;
  }
  .fab-group {
    padding: 0 16px 16px 16px;
    position: relative;
    flex-flow: column wrap;
    direction: ltr;
    display: flex;
  }
  .fab-button {
    margin: 8px;
  }
`

const PageEditor = ({ data, save }) => {
  const [page, setPage] = useState(null)

  useMemo(() => {
    if (data) {
      setPage(data)
    }
  }, [data])

  const handleOnChange = (fields) => {
    setPage(fields)
  }
  const handleSave = () => {
    save(page)
  }

  return (
    <StyledEditor>
      <div className="fab-group-container">
        <div className="fab-group">
          <Tooltip title="Save" placement="left">
            <Fab
              color="primary"
              aria-label="save"
              className="fab-button"
              onClick={handleSave}
            >
              <SaveIcon size="lg" />
            </Fab>
          </Tooltip>
        </div>
      </div>
      <Editor cellPlugins={cellPlugins} value={page} onChange={handleOnChange} />
    </StyledEditor>
  )
}

export default PageEditor
