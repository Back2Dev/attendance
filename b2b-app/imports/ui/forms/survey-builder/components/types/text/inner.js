import React from 'react'
import PropTypes from 'prop-types'
import { Button } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import { Item } from './item'
import {
  useTextAnswer,
  useTextQuestion,
  useSelectedPartValue,
} from '/imports/ui/forms/survey-builder/recoil/hooks'
import { useBuilder } from '/imports/ui/forms/survey-builder/context'
import { Question } from '/imports/ui/forms/survey-builder/components/question'

const TextInner = ({ pid }) => {
  const { all, add, update, remove } = useTextAnswer(pid)
  const [question, setQuestion] = useTextQuestion(pid)
  const selectedPart = useSelectedPartValue()
  const { isMobile } = useBuilder()
  console.log('all', all)
  const showMobileActions = isMobile && selectedPart === pid

  return (
    <div>
      <Question
        placeholder="Type your question"
        label={question}
        onLabelChange={(text) => setQuestion(text)}
      />

      {all.map((c, i) => (
        <Item
          key={i}
          onRemove={() => remove(i)}
          onAdd={() => add(i)}
          disableRemove={all.length === 1}
          onTextChange={(placeholder) => update({ ...c, placeholder }, i)}
          onChange={({ target: { value } }) => update({ ...c, type: value }, i)}
          type={c.type}
          text={c.name}
          showMobileActions={showMobileActions}
          pid={pid}
          index={i}
        />
      ))}
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

TextInner.propTypes = {
  /** section instance part id */
  pid: PropTypes.string.isRequired,
  /** function gets called when any choice gets updated */
  onChange: PropTypes.func,
}

TextInner.defaultProps = {
  initialList: [''],
}

export { TextInner }
