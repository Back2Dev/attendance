import React, { useContext } from 'react'
import styled from 'styled-components'
import moment from 'moment'
import numeral from 'numeral'
import { Helmet } from 'react-helmet'
import { Skeleton } from '@material-ui/lab'
import { Grid, Link, Typography } from '@material-ui/core'
// import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf'

import { JobsDetailsContext } from './context'
import CONSTANTS from '../../../../api/constants'
// import MechanicSelector from './info-mechanic'
import ExpectedPickupDate from './info-expected-pickup'

const StyledJobInfo = styled.div`
  .header-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    .title {
    }
  }
  .info-item {
    margin-bottom: 5px;
  }
  .label {
    font-weight: bold;
  }
  .data {
    border: 1px solid #bbbbbb;
    border-radius: 4px;
    padding: 5px;
    margin-right: 10px;
    line-height: 17px;
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
      <div className="header-container">
        <Typography variant="h1" className="title">
          {item?.jobNo} {item?.isRefurbish ? 'Refurbish' : item?.name}: {item?.bikeName}{' '}
          {`$${item?.totalCost / 100}`}
        </Typography>
      </div>
      <Grid container>
        <Grid item xs={12} md={item?.lastContacted ? 2 : 3} className="info-item">
          <Grid container>
            <Grid item xs={5} md={12} className="label">
              Budget
            </Grid>
            <Grid item xs={7} md={12}>
              <div className="data">
                {renderData(
                  item?.budget ? `$${numeral(item?.budget).format('0,0')}` : 'N/A'
                )}
              </div>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={item?.lastContacted ? 2 : 3} className="info-item">
          <Grid container>
            <Grid item xs={5} md={12} className="label">
              Phone
            </Grid>
            <Grid item xs={7} md={12}>
              <div className="data">
                {item?.phone
                  ? renderData(<Link href={`tel:${item.phone}`}>{item.phone}</Link>)
                  : renderData('N/A')}
              </div>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={3} className="info-item">
          <Grid container>
            <Grid item xs={5} md={12} className="label">
              Service type
            </Grid>
            <Grid item xs={7} md={12}>
              <div className="data">
                {renderData(item?.isRefurbish ? 'Refurbish' : 'Custom service')}
              </div>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={3} className="info-item">
          <Grid container>
            <Grid item xs={5} md={12} className="label">
              Expected pickup date
            </Grid>
            <Grid item xs={7} md={12} className="">
              <ExpectedPickupDate />
            </Grid>
          </Grid>
        </Grid>
        {item?.lastContacted && (
          <Grid item xs={12} md={2} className="info-item">
            <Grid container>
              <Grid item xs={5} md={12} className="label">
                Last contacted
              </Grid>
              <Grid item xs={7} md={12}>
                <div className="data">
                  {moment(item.lastContacted).format('DD/MM/YYYY HH:mm')}
                </div>
              </Grid>
            </Grid>
          </Grid>
        )}
      </Grid>
    </StyledJobInfo>
  )
}

export default JobInfo
