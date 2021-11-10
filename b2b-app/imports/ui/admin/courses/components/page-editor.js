import React, { useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import '@react-page/editor/lib/index.css'
import Fab from '@material-ui/core/Fab'
import Tooltip from '@material-ui/core/Tooltip'
import SaveIcon from '@material-ui/icons/Save'
import Editor from '@react-page/editor'
import styled from 'styled-components'
import cellPlugins from './cell-plugins'

const StyledEditor = styled.div`
  margin-top: 40px;
  margin-bottom: 40px;
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
  img {
    width: 100%;
  }
`

const PageEditor = ({ pageContent, data, save }) => {
  const [page, setPage] = useState(null)

  useMemo(() => {
    if (pageContent) {
      setPage(pageContent)
    }
  }, [pageContent])

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
      <Editor cellPlugins={cellPlugins(data)} value={page} onChange={handleOnChange} />
    </StyledEditor>
  )
}

PageEditor.propTypes = {
  pageContent: PropTypes.object,
  data: PropTypes.object.isRequired,
  save: PropTypes.func.isRequired,
}

export default PageEditor
