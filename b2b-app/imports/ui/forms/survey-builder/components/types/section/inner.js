import React from 'react'
import PropTypes from 'prop-types'
import { Button } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import { useBuilder } from '/imports/ui/forms/survey-builder/context'
import { Question } from '/imports/ui/forms/survey-builder/components/question'
import {
  useSection,
  useSelectedPartValue,
} from '/imports/ui/forms/survey-builder/recoil/hooks'

const SectionInner = ({ pid }) => {
  const [section, setSection] = useSection(pid)
  const selectedPart = useSelectedPartValue()
  const { isMobile } = useBuilder()

  const showMobileActions = isMobile && selectedPart === pid

  return (
    <div>
      <Question
        placeholder="Type your Section Name"
        label={section.name}
        onLabelChange={(text) => setSection((prev) => ({ ...prev, name: text }))}
      />

      {showMobileActions && (
        <Button
          variant="outlined"
          color="default"
          size="small"
          startIcon={<AddIcon />}
          onClick={() => add()}
        >
          New item
        </Button>
      )}
    </div>
  )
}

SectionInner.propTypes = {
  /** single instance part id */
  pid: PropTypes.string.isRequired,
  /** function gets called when any choice gets updated */
  onChange: PropTypes.func,
}

SectionInner.defaultProps = {
  initialList: [''],
}

export { SectionInner }
