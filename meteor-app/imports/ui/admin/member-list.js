import PropTypes from 'prop-types'
import React from 'react'
import { Avatar, Box, Button, Stack, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import './admin-member-list.css'
import CartList from './cart-list'
import PurchaseList from './purchase-list'
import { exportData } from '/imports/ui/utils/exporter'
import { getExportMap } from '/imports/ui/config/member-add-schemas'
import { expires, humaniseDate, isPast } from '/imports/helpers/dates'

const debug = require('debug')('b2b:admin')

const Admin = props => {
  const { members, orgid, getAllSessions } = props

  const memberClick = id => {
    debug(`memberClick(${id})`)
    props.history.push(`/admin/userprofiles/${id}`)
  }

  const exportNames = () => {
    exportData(members, `${orgid}-names`, getExportMap(orgid))
  }

  const sessionsMap = {}
  const mix = {}
  members.forEach(m => (mix[m._id] = m.name))
  'member name timeIn timeOut duration createdAt'.split(/\s+/).forEach(key => (sessionsMap[key] = key))

  const exportSessions = async () => {
    const ss = await getAllSessions()
    const sessions = ss.map(s => {
      return { member: mix[s.memberId], ...s }
    })
    exportData(sessions, `${orgid}-sessions`, sessionsMap)
  }

  const rows = members.map(member => ({
    id: member._id,
    member
  }))

  const columns = [
    {
      field: 'member',
      headerName: 'Member',
      flex: 1,
      minWidth: 320,
      sortable: false,
      renderCell: params => {
        const member = params.value
        return (
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              src={`/images/avatars/${member.avatar}`}
              alt={member.name}
              sx={{ cursor: 'pointer', border: '3px solid white' }}
              onClick={() => memberClick(member._id)}
            />
            <Box onClick={() => memberClick(member._id)} sx={{ cursor: 'pointer' }}>
              <Typography variant="subtitle1">{member.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {member.isHere ? 'Arrived:' : 'Last Seen'} {humaniseDate(member.lastIn)} ago
              </Typography>
            </Box>
          </Stack>
        )
      }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      minWidth: 160,
      sortable: false,
      renderCell: params => {
        const member = params.row.member
        return (
          <Button
            variant="contained"
            color="error"
            onClick={e => {
              e.preventDefault()
              props.removeMember(member._id)
            }}
          >
            Delete
          </Button>
        )
      }
    }
  ]

  return (
    <Box sx={{ width: '100%' }}>
      <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
        <Button type="button" variant="contained" onClick={exportNames}>
          Export names
        </Button>
        <Button type="button" variant="contained" onClick={exportSessions}>
          Export sessions
        </Button>
      </Stack>
      <DataGrid
        rows={rows}
        columns={columns}
        disableRowSelectionOnClick
        autoHeight
        getRowHeight={() => 'auto'}
        sx={{
          '& .MuiDataGrid-cell': { py: 1, alignItems: 'flex-start' },
          '& .MuiDataGrid-row': { maxHeight: 'none' }
        }}
      />
    </Box>
  )
}

Admin.propTypes = {
  members: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  removeMember: PropTypes.func.isRequired
}

export default Admin
