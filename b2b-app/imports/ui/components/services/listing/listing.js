import React, { useContext, useMemo, useState } from 'react'
import styled from 'styled-components'
import DataGrid from 'react-data-grid'

import { Button } from '@material-ui/core'

import CONSTANTS from '/imports/api/constants.js'
import SearchBox from '/imports/ui/components/commons/search-box.js'
import { JobsListingContext } from './context'
import moment from 'moment'
import { useHistory } from 'react-router'

const StyledJobsListing = styled.div`
  .filter-container {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 10px;
    .search-box {
    }
    .filter-status-container {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
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
          align-items: stretch;
          width: 100%;
          height: 64px;
          z-index: 1000;
          .status-filter {
            padding: 5px 3px;
            margin: 3px 1px;
            min-width: unset;
            font-size: 13px;
          }
        }
      }
      .grid-container {
        margin-bottom: 64px;
      }
    }
  `}
`

function JobsListing() {
  const {
    jobs,
    statusCounter,
    filterStatus,
    toggleFilterStatus,
    filterText,
    setFilterText,
  } = useContext(JobsListingContext)

  const { push } = useHistory()

  const defaultSortColums = [{ columnKey: 'createdAt', direction: 'DESC' }]
  const [sortColumns, setSortColumns] = useState(defaultSortColums)

  const columns = [
    {
      key: 'createdAt',
      name: 'Created Date',
      formatter: ({ row }) => moment(row.createdAt).format('DD/MM/YYYY HH:mm'),
      width: 140,
      // frozen: true,
    },
    {
      key: 'bike',
      name: 'Bike',
      // width: 120,
      // frozen: true,
    },
    {
      key: 'customer',
      name: 'Customer',
      // width: 120,
      // frozen: true,
    },
    {
      key: 'cost',
      name: 'Cost',
      // width: 150,
      // frozen: true,
    },
    {
      key: 'status',
      name: 'Status',
      formatter: ({ row }) => CONSTANTS.JOB_STATUS_READABLE[row.status] || 'N/A',
      // width: 150,
      // frozen: true,
    },
  ]

  const rows = useMemo(() => {
    return jobs.map((item) => {
      return {
        _id: item._id,
        createdAt: item.createdAt,
        bike: `${item.make} ${item.model}`,
        customer: item.name,
        cost: item.totalCost / 100,
        status: item.status,
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
      case 'createdAt':
        return (a, b) => {
          return a.createdAt > b.createdAt ? 1 : -1
        }
      case 'bike':
        return (a, b) => {
          return a.bike.localeCompare(b.bike)
        }
      case 'customer':
        return (a, b) => {
          return a.customer?.localeCompare(b.customer)
        }
      case 'cost':
        return (a, b) => {
          return a.cost > b.cost ? 1 : -1
        }
      case 'status':
        return (a, b) => {
          return a.status.localeCompare(b.status)
        }
      default:
        return () => 0
    }
  }

  const calculatedRows = useMemo(() => {
    if (sortColumns.length === 0) return rows

    let mutableRows = [...rows]

    // handle column sorting
    mutableRows.sort((a, b) => {
      for (const sort of sortColumns) {
        const comparator = getComparator(sort.columnKey)
        const compResult = comparator(a, b)
        if (compResult !== 0) {
          return sort.direction === 'ASC' ? compResult : -compResult
        }
      }
      return 0
    })

    // apply filter status
    if (filterStatus.length) {
      mutableRows = mutableRows.filter((row) => {
        return filterStatus.includes(row.status)
      })
    }

    // handle search
    if (filterText && filterText.length >= 2) {
      const reg = new RegExp(filterText, 'i')
      mutableRows = mutableRows.filter((row) => {
        // return reg.test(`${row.bike} ${row.customer} ${row.cost} ${row.createdAt}`)
        const strsToSearch = Object.values(row).map((value) => {
          return `${value}` || ''
        })
        // console.log(strsToSearch, strsToSearch.join(' '))
        return reg.test(strsToSearch.join(' '))
      })
    }

    return mutableRows
  }, [rows, sortColumns, filterStatus, filterText])

  const renderFilterStatusBtn = ({ title, status }) => {
    const isActive = filterStatus.includes(status)
    const classNames = ['status-filter']
    if (isActive) {
      classNames.push('active')
    }

    return (
      <Button
        key={`status-${status}`}
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

  const renderFilterBtn = () => {
    return Object.keys(CONSTANTS.JOB_STATUS_READABLE).map((status) => {
      const title = `${CONSTANTS.JOB_STATUS_READABLE[status]} (${
        statusCounter[status] || 'N/A'
      })`
      return renderFilterStatusBtn({ title, status })
    })
  }

  return (
    <StyledJobsListing>
      <div className="filter-container">
        <SearchBox
          onChange={(searchQuery) => {
            setFilterText(searchQuery)
          }}
        />
        <div className="filter-status-container">{renderFilterBtn()}</div>
      </div>
      <div className="grid-container">
        <DataGrid
          rowKeyGetter={rowKeyGetter}
          columns={columns}
          rows={calculatedRows}
          defaultColumnOptions={{
            sortable: true,
            resizable: true,
          }}
          sortColumns={sortColumns}
          onSortColumnsChange={(sorts) => {
            if (sorts && sorts.length) {
              setSortColumns(sorts)
            } else if (sortColumns[0]?.columnKey === 'createdAt') {
              setSortColumns([{ columnKey: 'createdAt', direction: 'ASC' }])
            } else {
              setSortColumns(defaultSortColums)
            }
          }}
          onRowClick={(index, row) => push(`/services/${row._id}`)}
          className="job-grid"
        />
      </div>
    </StyledJobsListing>
  )
}

export default JobsListing
