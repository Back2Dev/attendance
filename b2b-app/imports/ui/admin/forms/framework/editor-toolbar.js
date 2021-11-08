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
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'
import { Typography } from '@material-ui/core'

export const EditorToolbar = () => {
  const formContext = React.useContext(EditorContext)
  const [settings, setSettings] = React.useState(false)

  const settingsButton = React.useRef(null)

  const handleLayoutChange = (event) => {
    formContext.changeLayout(event.target.value)
  }

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
        <div style={{ display: 'table-cell', width: '33vw' }}>
          {formContext.layout === 'single' ? (
            <Tabs
              value={formContext.tab}
              indicatorColor="primary"
              textColor="primary"
              onChange={handleTabChange}
              aria-label="disabled tabs example"
            >
              <Tab label="formSchema" />
              <Tab label="json" />
            </Tabs>
          ) : (
            <span />
          )}
          <span style={{ width: '16px' }} />
        </div>

        <div style={{ display: 'table-cell', width: '33vw', textAlign: 'center' }}>
          <Typography
            variant="subtitle1"
            style={{ fontStyle: 'italic', alignSelf: 'center' }}
          >
            {formContext.name} ({formContext.slug})
          </Typography>
        </div>

        <div
          className="editorTools"
          style={{ display: 'table-cell', width: '33vw', textAlign: 'right' }}
        >
          <span>
            <Tooltip title="Settings">
              <IconButton
                color="default"
                aria-label="open settings"
                onClick={() => {
                  handleSettings()
                }}
                ref={settingsButton}
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
              anchorEl={settingsButton.current}
            >
              <div style={{ padding: '8px' }}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Editor Layout</FormLabel>
                  <RadioGroup
                    aria-label="gender"
                    name="layout"
                    value={formContext.layout}
                    onChange={handleLayoutChange}
                  >
                    <FormControlLabel value="single" control={<Radio />} label="Single" />
                    <FormControlLabel value="double" control={<Radio />} label="Double" />
                    <FormControlLabel
                      value="dnd"
                      disabled
                      control={<Radio />}
                      label="Drag and Drop"
                    />
                  </RadioGroup>
                </FormControl>
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
                        checked={formContext.autoSave}
                        onChange={formContext.toggleAutoSave}
                        name="autoSave"
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
          </span>
        </div>
      </div>
    </Paper>
  )
}
