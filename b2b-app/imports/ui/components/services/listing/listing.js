import React, { useContext, useMemo, useState } from 'react'
import styled from 'styled-components'
import DataGrid from 'react-data-grid'

import { Button } from '@material-ui/core'
import DateFnsUtils from '@date-io/date-fns'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
import { isAfter, isBefore } from 'date-fns'

import CONSTANTS from '/imports/api/constants.js'
import SearchBox from '/imports/ui/components/commons/search-box.js'
import { JobsListingContext } from './context'
import moment from 'moment'
import { useHistory } from 'react-router'

const StyledJobsListing = styled.div`
  .filter-container {
    // display: flex;
    // align-items: center;
    // flex-wrap: wrap;
    margin-bottom: 10px;
    .search-box {
      margin-right: 20px;
    }
    .filter-date-range {
      .date-range-picker {
        margin-right: 20px;
        width: 150px;
      }
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
    dateFrom,
    dateTo,
    setDateFrom,
    setDateTo,
  } = useContext(JobsListingContext)

  const { push } = useHistory()

  const defaultSortColumns = []
  const [sortColumns, setSortColumns] = useState(defaultSortColumns)

  const columns = [
    {
      key: 'createdAt',
      name: 'Created',
      formatter: ({ row }) => moment(row.createdAt).format('DD/MM/YYYY HH:mm'),
      width: 140,
      // frozen: true,
    },
    {
      key: 'pickupDate',
      name: 'Pickup date',
      formatter: ({ row }) => moment(row.pickupDate).format('DD/MM/YYYY'),
      width: 120,
      // frozen: true,
    },
    {
      key: 'jobNo',
      name: 'No',
      width: 60,
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
      width: 150,
      // frozen: true,
    },
    {
      key: 'phone',
      name: 'Phone',
      width: 150,
      // frozen: true,
    },
    {
      key: 'cost',
      name: 'Cost',
      width: 60,
      // frozen: true,
    },
    {
      key: 'status',
      name: 'Status',
      formatter: ({ row }) => CONSTANTS.JOB_STATUS_READABLE[row.status] || 'N/A',
      width: 150,
      // frozen: true,
    },
  ]

  const rows = useMemo(() => {
    return jobs.map((item) => {
      return {
        _id: item._id,
        createdAt: item.createdAt,
        pickupDate: item.pickupDate,
        jobNo: item.jobNo,
        bike: item.bikeName,
        customer: item.name,
        phone: item.phone,
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
      case 'pickupDate':
        return (a, b) => {
          return a.pickupDate > b.pickupDate ? 1 : -1
        }
      case 'jobNo':
        return (a, b) => {
          return `${a.jobNo}`.localeCompare(`${b.jobNo}`)
        }
      case 'bike':
        return (a, b) => {
          return `${a.bike}`.localeCompare(`${b.bike}`)
        }
      case 'customer':
        return (a, b) => {
          return `${a.customer}`.localeCompare(`${b.customer}`)
        }
      case 'phone':
        return (a, b) => {
          return `${a.phone}`.localeCompare(`${b.phone}`)
        }
      case 'cost':
        return (a, b) => {
          return a.cost > b.cost ? 1 : -1
        }
      case 'status':
        return (a, b) => {
          return `${a.status}`.localeCompare(`${b.status}`)
        }
      default:
        return () => 0
    }
  }

  const calculatedRows = useMemo(() => {
    // if (sortColumns.length === 0) return rows

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

    // apply date from filter
    if (dateFrom) {
      mutableRows = mutableRows.filter((row) => {
        return isAfter(row.createdAt, dateFrom)
      })
    }

    // apply date to filter
    if (dateTo) {
      mutableRows = mutableRows.filter((row) => {
        return isBefore(row.createdAt, dateTo)
      })
    }

    return mutableRows
  }, [rows, sortColumns, filterStatus, filterText, dateFrom, dateTo])

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

  const renderDateRangeFilter = () => {
    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
          className="date-range-picker"
          margin="normal"
          data-testid="dateFrom-picker-dialog"
          label="Date from"
          format="dd/MM/yyyy"
          value={dateFrom}
          onChange={(date) => setDateFrom(date)}
          KeyboardButtonProps={{
            'aria-label': 'change date from',
          }}
        />
        <KeyboardDatePicker
          className="date-range-picker"
          margin="normal"
          data-testid="dateTo-picker-dialog"
          label="Date to"
          format="dd/MM/yyyy"
          value={dateTo}
          onChange={(date) => setDateTo(date)}
          KeyboardButtonProps={{
            'aria-label': 'change date to',
          }}
        />
      </MuiPickersUtilsProvider>
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
          defaultValue={filterText}
          onChange={(searchQuery) => {
            setFilterText(searchQuery)
          }}
        />
        <div className="filter-date-range">{renderDateRangeFilter()}</div>
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
            } else {
              setSortColumns(defaultSortColumns)
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
