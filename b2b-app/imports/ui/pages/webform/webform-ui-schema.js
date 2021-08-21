import React from 'react'
import Grid from '@material-ui/core/Grid'
import Tabs from '@material-ui/core/Tabs'
import { makeStyles } from '@material-ui/core/styles'
import Tab from '@material-ui/core/Tab'
import getSchemas, { evaluate } from '/imports/api/surveys/survey-schema-ui-schema'
import ShowCode from './components/show-code'
// import Demo from './demo'
import Demo from './take2'
// import UserSettings from './user-settings'

const debug = require('debug')('app:webforms-progress')

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: '100%',
  },
  tabContent: {
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '80%',
      textAlign: 'center',
      margin: 'auto',
    },
  },
  tabs: {
    textAlign: 'center',
    '& .MuiTabs-flexContainer': {
      display: 'block',
    },
  },
}))

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`,
  }
}

const Progress = ({ schema }) => {
  const [tab, setTab] = React.useState(0)

  const handleTabs = (event, newValue) => {
    setTab(newValue)
  }

  const classes = useStyles()
  return (
    <Grid item xs={12} className={classes.tabs}>
      <Tabs
        value={tab}
        onChange={handleTabs}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
        aria-label="scrollable auto tabs example"
      >
        <Tab key={0} label="Preview" {...a11yProps(0)} />
        <Tab key={1} label="Schema JSON" {...a11yProps(1)} />
      </Tabs>
      <div className={classes.tabContent}>
        <div role="tabpanel" hidden={tab !== 0}>
          <h1>Preview</h1>
          <Demo></Demo>
        </div>
        <div
          role="tabpanel"
          hidden={tab !== 1}
          style={{ height: '100%', textAlign: 'left' }}
        >
          <h1>ui-schema</h1>
          <ShowCode code={schema}></ShowCode>
        </div>
      </div>
    </Grid>
  )
}

const WebformPage = ({
  formData,
  id,
  listing,
  methods,
  profile,
  survey,
  notes,
  task,
  currentRole,
  reject,
  setDocumentList,
  documentList,
  goForwardStage,
}) => {
  const save = (models) => {
    Object.keys(models).forEach((stepid, ix) => {
      const model = models[stepid]
      // })
      // models.forEach((model, ix) => {
      // const stepid = key
      if (!formData[stepid]) formData[stepid] = {}
      Object.keys(model).forEach((key) => (formData[stepid][key] = model[key]))
    })
    methods.update(formData)
  }

  // Build the schema
  const schema = getSchemas(survey, formData)
  return <Progress schema={schema} save={save} />
}

export default WebformPage
