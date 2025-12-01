import React from 'react'
import PropTypes from 'prop-types'
import { Button } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { useBuilder } from '/imports/ui/forms/survey-builder/context'
import { useSelectedPartValue } from '/imports/ui/forms/survey-builder/recoil/hooks'

const SectionInner = ({ pid }) => {
  const selectedPart = useSelectedPartValue()
  const { isMobile } = useBuilder()
  const showMobileActions = isMobile && selectedPart === pid

  return (
    <div>
      {showMobileActions && (
        <Button
          variant="outlined"
          size="small"
          startIcon={<AddIcon />}
          onClick={() => add()}>
          New item
        </Button>
      )}
    </div>
  );
}

SectionInner.propTypes = {
  /** single instance part id */
  pid: PropTypes.string.isRequired,
}

SectionInner.defaultProps = {
  initialList: [''],
}

export { SectionInner }
