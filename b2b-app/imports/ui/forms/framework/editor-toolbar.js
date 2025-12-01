import React, { Fragment } from 'react'
import { EditorContext } from './framework'
import './resizer.css'
import Paper from '@mui/material/Paper'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import IconButton from '@mui/material/IconButton'
import SaveIcon from '@mui/icons-material/Save'
import SettingsIcon from '@mui/icons-material/Settings'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import VisibilityIcon from '@mui/icons-material/Visibility'
import Tooltip from '@mui/material/Tooltip'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import Popover from '@mui/material/Popover'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import { Typography } from '@mui/material'

export const EditorToolbar = () => {
  const formContext = React.useContext(EditorContext)
  const [settings, setSettings] = React.useState(false)
  const anchorEl = React.useRef(null)

  // const settingsButton = React.useRef(null)

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

  const isDnDMode = formContext.layout === 'dnd'

  return (
    <Paper square id="back-to-top-anchor">
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
          {/* toggle button for dnd editor */}

          {isDnDMode && (
            <Fragment>
              <Tooltip title="View Form">
                <Switch
                  checked={formContext.checked}
                  onChange={() => {
                    formContext.setChecked(!formContext.checked)
                    formContext.compileForm()
                  }}
                  name="viewForm"
                  color="primary"
                />
              </Tooltip>

              {/* <Tooltip title="View JSON">
                <IconButton
                  aria-label="view json"
                  onClick={() => formContext.setViewJSON(!formContext.viewJSON)}
                  // className={classes.icon}
                >
                  <VisibilityIcon />
                </IconButton>
              </Tooltip> */}
            </Fragment>
          )}
          <span>
            <Tooltip title="Settings">
              <IconButton
                ref={anchorEl}
                color="default"
                aria-label="open settings"
                onClick={() => {
                  handleSettings()
                }}
                size="large">
                <SettingsIcon />
              </IconButton>
            </Tooltip>
            <Popover
              open={settings}
              onClose={handleSettings}
              anchorEl={anchorEl.current}
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
                      control={<Radio />}
                      label="Drag and drop"
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
                    label="Auto run"
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
                    label="Auto save"
                  />
                </FormGroup>
              </div>
            </Popover>
            {!isDnDMode && (
              <Tooltip title="Run form">
                <IconButton
                  color="secondary"
                  aria-label="run form"
                  data-cy="run-form"
                  onClick={() => {
                    formContext.compileForm()
                  }}
                  size="large">
                  <PlayArrowIcon />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="Save">
              <IconButton
                color="primary"
                aria-label="save"
                onClick={() => formContext.save(false)}
                size="large">
                <SaveIcon />
              </IconButton>
            </Tooltip>
          </span>
        </div>
      </div>
    </Paper>
  );
}
