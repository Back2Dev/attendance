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
    const serviceItems = item.serviceItems
    const bikeDetails = {
      bikeName: item.bikeName,
      pickup: item.pickupDate,
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

    createJobCard({ serviceItems, bikeDetails, contactData })
  }

  return (
    <StyledCreatePDF>
      <Button variant="contained" startIcon={<DescriptionIcon />} onClick={createPdf}>
        Job Card
      </Button>
    </StyledCreatePDF>
  )
}

export default CreatePDF
