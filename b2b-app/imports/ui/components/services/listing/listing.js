import React, { useCallback, useContext, useMemo, useState } from 'react'
import styled from 'styled-components'
import DataGrid, { Column, SortableHeaderCell } from 'react-data-grid'

import { Button, Typography } from '@material-ui/core'

import SearchBox from '/imports/ui/components/commons/search-box.js'
import { JobsListingContext } from './context'

const StyledJobsListing = styled.div`
  .filter-container {
    display: flex;
    flex-wrap: wrap;
    .filter-status-container {
      display: flex;
      flex-wrap: wrap;
    }
    .status-filter {
      padding: 5px 10px;
      margin: 3px 3px;
      .MuiButton-label {
        line-height: 1rem;
      }
      &.active {
        background-color: #007cfdde;
        color: #fff;
      }
    }
  }
  .grid-container {
    .job-grid {
      height: 500px;
    }
  }
  ${({ theme }) => `
    ${theme.breakpoints.down('xs')} {
      .filter-container {
        .search-box {
          width: 100%;
        }
        .filter-status-container {
          position: fixed;
          bottom: 0;
          left: 0;
          flex-wrap: nowrap;
          justify-content: space-between;
          width: 100%;
          .status-filter {
            padding: 5px 3px;
            margin: 3px 1px;
            min-width: unset;
          }
        }
      }
    }
  `}
`

function JobsListing() {
  const { loading, jobs, filterStatus, toggleFilterStatus, setFilterText } = useContext(
    JobsListingContext
  )

  const [sortColumns, setSortColumns] = useState([])
  // const [sortDirection, setSortDirection] = useState('ASC')

  const columns = [
    {
      key: '_id',
      name: 'ID',
      // width: 120,
      // frozen: true,
      resizable: true,
    },
    {
      key: 'bike',
      name: 'Bike',
      // width: 120,
      // frozen: true,
      resizable: true,
    },
    {
      key: 'customer',
      name: 'Customer',
      // width: 120,
      // frozen: true,
      resizable: true,
    },
    {
      key: 'status',
      name: 'Status',
      // width: 60,
      // frozen: true,
      resizable: true,
    },
  ]

  // TODO: change list of status
  const availableStatus = ['new', 'in-progress', 'quality-check', 'ready', 'archived']

  const rows = useMemo(() => {
    return jobs.map((item) => {
      return {
        _id: item._id,
        bike: `${item.make} ${item.model}`,
        customer: item.name,
        status: availableStatus[Math.floor(availableStatus.length * Math.random())],
      }
    })
  }, [jobs])

  const rowKeyGetter = (row) => {
    return row._id
  }

  const getComparator = () => {
    // console.log(sortColumns)
    if (!sortColumns.length) {
      return () => 0
    }
    switch (sortColumns[0].columnKey) {
      case '_id':
        return (a, b) => {
          return a._id.localeCompare(b._id)
        }
      case 'bike':
        return (a, b) => {
          return a.bike.localeCompare(b.bike)
        }
      case 'customer':
        return (a, b) => {
          return a.customer?.localeCompare(b.customer)
        }
      case 'status':
        return (a, b) => {
          return a.status.localeCompare(b.status)
        }
      default:
        return () => 0
    }
  }

  const sortedRows = useMemo(() => {
    if (sortColumns.length === 0) return rows

    const sortedRows = [...rows]
    sortedRows.sort((a, b) => {
      for (const sort of sortColumns) {
        const comparator = getComparator(sort.columnKey)
        const compResult = comparator(a, b)
        if (compResult !== 0) {
          return sort.direction === 'ASC' ? compResult : -compResult
        }
      }
      return 0
    })
    return sortedRows
  }, [rows, sortColumns])

  const renderFilterStatusBtn = ({ title, status }) => {
    const isActive = filterStatus.includes(status)
    const classNames = ['status-filter']
    if (isActive) {
      classNames.push('active')
    }
    return (
      <Button
        className={classNames.join(' ')}
        variant="contained"
        onClick={() => {
          toggleFilterStatus(status)
        }}
      >
        {title}
      </Button>
    )
  }

  return (
    <StyledJobsListing>
      <div className="filter-container">
        <SearchBox
          onChange={(searchQuery) => {
            setFilterText(searchQuery)
          }}
        />
        <div className="filter-status-container">
          {renderFilterStatusBtn({ title: 'New', status: 'new' })}
          {renderFilterStatusBtn({ title: 'In Progress', status: 'in-progress' })}
          {renderFilterStatusBtn({ title: 'Quality check', status: 'quality-check' })}
          {renderFilterStatusBtn({ title: 'Ready', status: 'ready' })}
          {renderFilterStatusBtn({ title: 'Archived', status: 'archived' })}
        </div>
      </div>
      <div className="grid-container">
        <DataGrid
          rowKeyGetter={rowKeyGetter}
          columns={columns}
          rows={sortedRows}
          defaultColumnOptions={{
            sortable: true,
            resizable: true,
          }}
          sortColumns={sortColumns}
          onSortColumnsChange={setSortColumns}
          className="job-grid"
        />
      </div>
    </StyledJobsListing>
  )
}

export default JobsListing
