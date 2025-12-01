import React from 'react'

import makeStyles from '@mui/styles/makeStyles';

import KioskPage from './kiosk.js'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(1),
      width: theme.spacing(16),
      height: theme.spacing(16),
    },
  },
}))

export default {
  title: 'kioskPage',
  component: KioskPage,
  parameters: {
    viewport: {
      // defaultViewport:  'iphone6',
    },
    layout: 'fullscreen',
  },
  decorators: [(Story) => <Story />],
}
