import React from 'react'
import PropTypes from 'prop-types'
import { EditorContext } from './framework'
import './resizer.css'

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

export const EditorToolbar = ({ tab, onTabChange }) => {
  const formContext = React.useContext(EditorContext)

  const [autoRun, setAutoRun] = React.useState(false)

  return (
    <Paper square>
      <div className="editorBar">
        <Tabs
          value={tab}
          indicatorColor="primary"
          textColor="primary"
          onChange={onTabChange}
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

EditorToolbar.propTypes = {
  tab: PropTypes.number.isRequired,
  onTabChange: PropTypes.func.isRequired,
}
