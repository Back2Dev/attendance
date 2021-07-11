import React, { useContext } from 'react'
import styled from 'styled-components'
import moment from 'moment'
import numeral from 'numeral'
import { Helmet } from 'react-helmet'
import { Skeleton } from '@material-ui/lab'
import { Grid, Link } from '@material-ui/core'

import { JobsDetailsContext } from './context'
import CONSTANTS from '../../../../api/constants'
import MechanicSelector from './info-mechanic'
import ExpectedPickupDate from './info-expected-pickup'

const StyledJobInfo = styled.div`
  .label {
    font-weight: bold;
  }
`

function JobInfo() {
  const { item, loading } = useContext(JobsDetailsContext)

  const renderData = (data) => {
    if (loading || !item) {
      return <Skeleton width="80%" />
    }
    return data
  }

  return (
    <StyledJobInfo>
      <Helmet>
        <title>Service details {item?._id || ''}</title>
      </Helmet>
      <Grid container>
        <Grid item xs={12} md={2}>
          <Grid container>
            <Grid item xs={5} md={12} className="label">
              Customer
            </Grid>
            <Grid item xs={7} md={12} className="data">
              {renderData(`${item?.name || 'N/A'}`)}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={3}>
          <Grid container>
            <Grid item xs={5} md={12} className="label">
              Bike name
            </Grid>
            <Grid item xs={7} md={12} className="data">
              {renderData(`${item?.make} ${item?.model}`)}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={3}>
          <Grid container>
            <Grid item xs={5} md={12} className="label">
              Bike color
            </Grid>
            <Grid item xs={7} md={12} className="data">
              {renderData(`${item?.color}`)}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={2}>
          <Grid container>
            <Grid item xs={5} md={12} className="label">
              Budget
            </Grid>
            <Grid item xs={7} md={12} className="data">
              {renderData(`$${numeral(item?.budget).format('0,0')}`)}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={2}>
          <Grid container>
            <Grid item xs={5} md={12} className="label">
              Phone
            </Grid>
            <Grid item xs={7} md={12} className="data">
              {item?.phone
                ? renderData(<Link href={`tel:${item.phone}`}>{item.phone}</Link>)
                : renderData('N/A')}
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} md={2}>
          <Grid container>
            <Grid item xs={5} md={12} className="label">
              Due date
            </Grid>
            <Grid item xs={7} md={12} className="data">
              {renderData(moment(item?.pickupDate).format('DD/MM/YYYY'))}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={3}>
          <Grid container>
            <Grid item xs={5} md={12} className="label">
              Service type
            </Grid>
            <Grid item xs={7} md={12} className="data">
              {renderData(item?.isRefurbish ? 'Refurbish' : 'Custom service')}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={3}>
          <Grid container>
            <Grid item xs={5} md={12} className="label">
              Mechanic
            </Grid>
            <Grid item xs={7} md={12} className="data">
              <MechanicSelector />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={2}>
          <Grid container>
            <Grid item xs={5} md={12} className="label">
              Cost
            </Grid>
            <Grid item xs={7} md={12} className="data">
              {renderData(`$${item?.totalCost / 100}`)}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={2}>
          <Grid container>
            <Grid item xs={5} md={12} className="label">
              Status
            </Grid>
            <Grid item xs={7} md={12} className="data">
              {renderData(CONSTANTS.JOB_STATUS_READABLE[item?.status])}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={3}>
          <Grid container>
            <Grid item xs={5} md={12} className="label">
              Expected pickup date
            </Grid>
            <Grid item xs={7} md={12} className="data">
              <ExpectedPickupDate />
            </Grid>
          </Grid>
        </Grid>
        {item?.lastContacted && (
          <Grid item xs={12} md={2}>
            <Grid container>
              <Grid item xs={5} md={12} className="label">
                Last contacted
              </Grid>
              <Grid item xs={7} md={12} className="data">
                {moment(item.lastContacted).format('DD/MM/YYYY HH:mm')}
              </Grid>
            </Grid>
          </Grid>
        )}
      </Grid>
    </StyledJobInfo>
  )
}

export default JobInfo
