import React from 'react'

import { Controlled as CodeMirror } from 'react-codemirror2'
import { EditorContext } from './framework'
import Paper from '@material-ui/core/Paper'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import IconButton from '@material-ui/core/IconButton'
import SaveIcon from '@material-ui/icons/Save'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import Tooltip from '@material-ui/core/Tooltip'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'

require('codemirror/lib/codemirror.css')
require('codemirror/theme/dracula.css')
require('codemirror/theme/panda-syntax.css')
require('codemirror/theme/material.css')
require('codemirror/mode/javascript/javascript')
import './resizer.css'
import SplitPane from 'react-split-pane'

const codemirrorOptions = {
  autoCloseBrackets: true,
  cursorScrollMargin: 48,
  mode: 'null',
  lineNumbers: true,
  indentUnit: 2,
  tabSize: 2,
  styleActiveLine: true,
  viewportMargin: 99,
  theme: 'material',
}

export const EditorPanel = () => {
  const formContext = React.useContext(EditorContext)

  const [tab, setTab] = React.useState(0)
  const [autoRun, setAutoRun] = React.useState(false)

  const handleTabChange = (e, index) => {
    setTab(index)
  }

  const codemirrorRef = React.useRef()

  React.useEffect(() => {
    const height = document.getElementsByClassName('Pane horizontal Pane1')[0]
      .clientHeight
    console.log(height)
    const current = (codemirrorRef.current.editor.display.wrapper.style.height = `${
      height - 48
    }px`)
  })

  const resize = () => {
    const height = document.getElementsByClassName('Pane horizontal Pane1')[0]
      .clientHeight
    console.log(height)
    const current = (codemirrorRef.current.editor.display.wrapper.style.height = `${
      height - 48
    }px`)
  }

  return (
    <SplitPane split="horizontal" defaultSize="50%" onChange={resize}>
      <div className="container">
        <Paper square>
          <div className="editorBar">
            <Tabs
              value={tab}
              indicatorColor="primary"
              textColor="primary"
              onChange={handleTabChange}
              aria-label="disabled tabs example"
            >
              <Tab label="details.form" />
              <Tab label="detailsForm.json" />
            </Tabs>
            <div className="editorTools">
              <FormGroup row>
                <FormControlLabel
                  control={
                    <Switch
                      checked={autoRun}
                      onChange={() => setAutoRun(autoRun ? false : true)}
                      name="autoRun"
                      color="primary"
                    />
                  }
                  label="AutoRun"
                />
              </FormGroup>
              <Tooltip title="Run form">
                <IconButton color="secondary" aria-label="run form">
                  <PlayArrowIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Save">
                <IconButton color="primary" aria-label="save">
                  <SaveIcon />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        </Paper>

        <CodeMirror
          value={formContext.editors[tab].editorValue}
          options={{ ...codemirrorOptions, mode: formContext.editors[tab].editorType }}
          onBeforeChange={(editor, data, value) => {
            formContext.editors[tab].updateEditor(value)
          }}
          ref={codemirrorRef}
        />
      </div>
      <div>
        <h1>Errors</h1>
      </div>
    </SplitPane>
  )
}
