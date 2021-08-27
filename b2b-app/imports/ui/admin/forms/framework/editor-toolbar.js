import React from 'react'
import { EditorContext } from './framework'
import './resizer.css'

import Paper from '@material-ui/core/Paper'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import IconButton from '@material-ui/core/IconButton'
import SaveIcon from '@material-ui/icons/Save'
import SettingsIcon from '@material-ui/icons/Settings'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import Tooltip from '@material-ui/core/Tooltip'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import Popover from '@material-ui/core/Popover'

export const EditorToolbar = () => {
  const formContext = React.useContext(EditorContext)
  const [settings, setSettings] = React.useState(false)

  const handleTabChange = (e, index) => {
    formContext.changeTab(index)
    if (index === 0) {
      formContext.showErrors(formContext.errors)
    } else {
      formContext.hideErrors()
    }
  }

  const handleSettings = () => {
    setSettings(settings ? false : true)
  }

  return (
    <Paper square>
      <div className="editorBar">
        <Tabs
          value={formContext.tab}
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
                  checked={formContext.autoRun}
                  onChange={formContext.toggleAutoRun}
                  name="autoRun"
                  color="primary"
                />
              }
              label="AutoRun"
            />
          </FormGroup>
          <Tooltip title="Settings">
            <IconButton
              color="grey"
              aria-label="open settings"
              onClick={() => {
                handleSettings()
              }}
            >
              <SettingsIcon />
            </IconButton>
          </Tooltip>
          <Popover
            open={settings}
            onClose={handleSettings}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <div style={{ padding: '8px' }}>
              <FormGroup row>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formContext.autoRun}
                      onChange={formContext.toggleAutoRun}
                      name="autoRun"
                      color="primary"
                    />
                  }
                  label="AutoRun"
                />
              </FormGroup>
              <FormGroup row>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formContext.autoRun}
                      onChange={formContext.toggleAutoRun}
                      name="autoRun"
                      color="primary"
                    />
                  }
                  label="AutoSave"
                />
              </FormGroup>
            </div>
          </Popover>
          <Tooltip title="Run form">
            <IconButton
              color="secondary"
              aria-label="run form"
              onClick={() => {
                formContext.compileForm()
              }}
            >
              <PlayArrowIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Save">
            <IconButton
              color="primary"
              aria-label="save"
              onClick={() => formContext.save(false)}
            >
              <SaveIcon />
            </IconButton>
          </Tooltip>
        </div>
      </div>
    </Paper>
  )
}
