import React, { useContext, useMemo, useState } from 'react'
import styled from 'styled-components'
import { DataGrid } from '@mui/x-data-grid'

import { Button } from '@mui/material'
import DateFnsUtils from '@date-io/date-fns'
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

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
    ${theme.breakpoints.down('sm')} {
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

  const filteredRows = useMemo(() => {
    let mutableRows = [...rows]
    if (filterText && filterText.length >= 2) {
      const reg = new RegExp(filterText, 'i')
      mutableRows = mutableRows.filter((row) => {
        const strsToSearch = Object.values(row).map((value) => {
          return `${value}` || ''
        })
        return reg.test(strsToSearch.join(' '))
      })
    }

    if (dateFrom) {
      mutableRows = mutableRows.filter((row) => {
        return moment(row.createdAt).isAfter(moment(dateFrom).startOf('day'))
      })
    }

    if (dateTo) {
      mutableRows = mutableRows.filter((row) => {
        return moment(row.createdAt).isBefore(moment(dateTo).endOf('day'))
      })
    }

    return mutableRows
  }, [filterText, dateFrom, dateTo, rows])

  const statusCounter = useMemo(() => {
    const statusCounter = {}
    filteredRows.map((row) => {
      statusCounter[row.status] = (statusCounter[row.status] || 0) + 1
    })

    return statusCounter
  }, [filteredRows])

  const calculatedRows = useMemo(() => {
    // if (sortColumns.length === 0) return rows

    let mutableRows = [...filteredRows]

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

    return mutableRows
  }, [filteredRows, sortColumns, filterStatus])

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
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          className="date-range-picker"
          format="dd/MM/yyyy"
          label="Date from"
          value={dateFrom}
          onChange={(date) => setDateFrom(date)}
          slotProps={{
            textField: {
              margin: 'normal',
              'data-testid': 'dateFrom-picker-dialog',
            },
            openPickerButton: {
              'aria-label': 'change date from',
            },
          }}
        />
        <DatePicker
          className="date-range-picker"
          format="dd/MM/yyyy"
          label="Date to"
          value={dateTo}
          onChange={(date) => setDateTo(date)}
          slotProps={{
            textField: {
              margin: 'normal',
              'data-testid': 'dateTo-picker-dialog',
            },
            openPickerButton: {
              'aria-label': 'change date to',
            },
          }}
        />
      </LocalizationProvider>
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
