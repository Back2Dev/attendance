import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import EditTeam from './edit-team.js'

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
  title: 'editTeam',
  component: EditTeam,
  parameters: {
    viewport: {
      // defaultViewport:  'iphone6',
    },
    layout: 'fullscreen',
  },
  decorators: [(Story) => <Story />],
}
