import React, { useContext } from 'react'
import styled from 'styled-components'

import { Button } from '@material-ui/core'
import DescriptionIcon from '@material-ui/icons/Description'

import createJobCard from '/imports/ui/utils/job-card-pdf.js'

import { JobsDetailsContext } from './context'

const StyledCreatePDF = styled.div``

function CreatePDF() {
  const { item } = useContext(JobsDetailsContext)

  const createPdf = () => {
    const { serviceType, serviceItems, assessor, jobNo } = item
    const bikeDetails = {
      bikeName: item.bikeName,
      dropoffDate: item.dropoffDate,
      pickupDate: item.pickupDate,
      budget: item.budget,
      replacementBike: item.replacementBike,
      note: item.note,
    }
    const contactData = {
      memberData: item.memberId
        ? {
            name: item.name,
            email: item.email,
            mobile: item.phone,
          }
        : null,
    }

    createJobCard({
      serviceType,
      serviceItems,
      bikeDetails,
      contactData,
      assessor,
      jobNo,
    })
  }

  return (
    <StyledCreatePDF>
      <Button variant="contained" data-cy="job-card" startIcon={<DescriptionIcon />} onClick={createPdf}>
        Job Card
      </Button>
    </StyledCreatePDF>
  )
}

export default CreatePDF
