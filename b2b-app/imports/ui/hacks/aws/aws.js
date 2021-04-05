import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import UploadAvatar from './upload-avatar'
import FileUploader from '/imports/ui/components/file-upload'
import TabPanel from '/imports/ui/components/tab-panel.js'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

const debug = require('debug')('se:upload-s3-test')

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
}))

const AWS = ({ save, handleMethod }) => {
  const classes = useStyles()
  const [tab, setTab] = React.useState(0)

  const handleChange = (event, newValue) => {
    setTab(newValue)
  }

  return (
    <>
      <AppBar position="static" color="transparent" elevation={0}>
        <Tabs
          value={tab}
          onChange={handleChange}
          aria-label="aws-tabs"
          indicatorColor="primary"
        >
          <Tab label="Avatar" {...a11yProps(0)} />
          <Tab label="S3" {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <TabPanel value={tab} index={0}>
        <UploadAvatar save={save} />
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <FileUploader
          metaContext={{
            fileName: 'testFile',
            listing: '999',
            folder: 'test',
          }}
          handleMethod={handleMethod}
        />
      </TabPanel>
    </>
  )
}

export default AWS
