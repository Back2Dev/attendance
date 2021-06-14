import React, { useContext } from 'react'
import styled from 'styled-components'

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
    </StyledJobsListing>
  )
}

export default JobsListing
