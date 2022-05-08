import React from 'react'
import {
  useUploadQuestion,
  // useUploadAnswers,
  // useSelectedPartValue,
} from 'imports/ui/forms/survey-builder/recoil/hooks'
import { Question } from 'imports/ui/forms/survey-builder/components/question'
import { DropZone } from './item'
// import AddIcon from '@material-ui/icons/Add'
// import { Button } from '@material-ui/core'

export const InnerUpload = ({ pid }) => {
  const [question, setQuestion] = useUploadQuestion(pid)
  // const selectedPart = useSelectedPartValue()
  // const { add } = useUploadAnswers(pid)
  // const { isMobile } = useBuilder()
  // const showMobileActions = isMobile && selectedPart === pid
  return (
    <div>
      <Question
        placeholder="Type your question"
        label={question}
        onLabelChange={(text) => setQuestion(text)}
      />

      <DropZone pid={pid} />
      {/* {showMobileActions && (
        <Button
          variant="outlined"
          color="default"
          size="small"
          startIcon={<AddIcon />}
          onClick={() => add()}
        >
          New item
        </Button>
      )} */}
    </div>
  )
}
