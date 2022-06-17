import React from 'react'
import PropTypes from 'prop-types'
import { Button, Grid } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import { useBuilder } from '/imports/ui/forms/survey-builder/context'
import { Question } from '/imports/ui/forms/survey-builder/components/question'
import {
  useSection,
  useSelectedPartValue,
} from '/imports/ui/forms/survey-builder/recoil/hooks'
import { PropertyField } from '/imports/ui/forms/survey-builder/components/panels/inspector/edit-property'
import { Item } from '$sb/components/types/single/item'

const SectionInner = ({ pid }) => {
  const [section, setSection] = useSection(pid)
  const selectedPart = useSelectedPartValue()
  const { isMobile } = useBuilder()

  const showMobileActions = isMobile && selectedPart === pid

  return (
    <div>
      {/* {Object.entries(section).map(([key, value]) => {
        if (key === 'name' || key === 'prompt' || key === 'id') {
          return
        } else {
          return (
            <Grid container spacing={1} alignItems="flex-end">
              <Grid item>
                <Item
                  onDeleteOption={() =>
                    setPropertyByValue({
                      path: key,
                    })
                  }
                  onChange={({ target: { value } }) =>
                    setPropertyByValue({
                      path: key,
                      value,
                      pid,
                    })
                  }
                  label={key.toUpperCase()}
                  text={value}
                  showMobileActions={showMobileActions}
                  placeholder={key.toUpperCase()}
                  actions={['deleteOption']}
                  path={key}
                  type={'option'}
                />
              </Grid>
            </Grid>
          )
        }
      })} */}

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
