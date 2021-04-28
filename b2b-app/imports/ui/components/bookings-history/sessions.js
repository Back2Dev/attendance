import React, { useContext } from 'react'
import styled from 'styled-components'

import { Skeleton } from '@material-ui/lab'
import { DataGrid } from '@material-ui/data-grid'

import Loading from '../commons/loading'
import { BookingsHistoryContext } from './context'

const StyledSessionsListing = styled.div``

function SessionsListing() {
  const { loadingSessions, loadingEvents, sessionsWData } = useContext(
    BookingsHistoryContext
  )
  console.log(sessionsWData)

  const columns = [
    { field: 'date', headerName: 'Date', type: 'date', width: 100 },
    { field: 'name', headerName: 'Name', width: 130 },
    { field: 'tool', headerName: 'Tool', width: 130 },
    {
      field: 'status',
      headerName: 'Status',
      // sortable: false,
      width: 100,
      // valueGetter: (params) =>
      //   `${params.getValue('firstName') || ''} ${params.getValue('lastName') || ''}`,
    },
  ]

  const rows = sessionsWData.map((item) => {
    return {
      id: item._id,
      date: item.bookedDate,
      name: item.name,
      tool: item.toolName,
      status: item.status,
    }
  })

  return (
    <StyledSessionsListing>
      <Loading loading={loadingSessions || loadingEvents} />
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid rows={rows} columns={columns} pageSize={5} />
      </div>
    </StyledSessionsListing>
  )
}

export default SessionsListing
