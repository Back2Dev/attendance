import React, { useContext } from 'react'
import styled from 'styled-components'

import { Button, Typography } from '@material-ui/core'

import SearchBox from '/imports/ui/components/commons/search-box.js'
import { JobsListingContext } from './context'

const StyledJobsListing = styled.div`
  .filter-container {
    display: flex;
    flex-wrap: wrap;
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
      .search-box {
        width: 100%;
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
        {renderFilterStatusBtn({ title: 'New', status: 'new' })}
        {renderFilterStatusBtn({ title: 'In Progress', status: 'in-progress' })}
        {renderFilterStatusBtn({ title: 'Quality check', status: 'quality-check' })}
        {renderFilterStatusBtn({ title: 'Ready', status: 'ready' })}
        {renderFilterStatusBtn({ title: 'Archived', status: 'archived' })}
      </div>
    </StyledJobsListing>
  )
}

export default JobsListing
