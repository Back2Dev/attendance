import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import editTeam from './edit-team'

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
const columns = [
  {
    field: 'firstName',
    headerName: 'First name',
    width: 150,
    editable: true,
  },
  {
    field: 'handle',
    headerName: 'Handle',
    width: 150,
    editable: true,
  },
  {
    field: 'joined',
    headerName: 'Joined',
    type: 'date',
    width: 110,
    editable: true,
  },
  {
    field: 'active',
    headerName: 'Active',
    width: 1,
    editable: true,
  },
  {
    field: 'delete',
    headerName: 'Delete',
    width: 1,
    editable: true,
  },
]

const rows = [
  {
    firstName: 'Mike King',
    handle: 'mikkel',
    joined: '1/02/2021',
    active: 'Y',
    delete: <Button>x</Button>,
  },
  {
    firstName: 'Patrick Carmelt',
    handle: 'pato',
    joined: '1/2/2021',
    active: 'Y',
    delete: <Button>x</Button>,
  },
  {
    firstName: 'Chris Tri',
    handle: 'ct',
    joined: '1/12/2021',
    active: 'N',
    delete: <Button>x</Button>,
  },
  {
    firstName: 'Minh Ngyuen',
    handle: 'minster',
    joined: '1/12/2021',
    active: 'Y',
    delete: <Button>x</Button>,
  },
]

export default {
  title: 'editTeam',
  component: editTeam,
  parameters: {
    viewport: {
      // defaultViewport:  'iphone6',
    },
    layout: 'fullscreen',
  },
  decorators: [(Story) => <Story />],
}
