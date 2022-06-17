import React from 'react'
import { useUploadQuestion } from '/imports/ui/forms/survey-builder/recoil/hooks'
import { Question } from '/imports/ui/forms/survey-builder/components/question'
import { DropZone } from './item'

export const UploadInner = ({ pid }) => {
  // const [question, setQuestion] = useUploadQuestion(pid)
  return (
    <div>
      {/* <Question
        placeholder="Type your question"
        label={question}
        onLabelChange={(text) => setQuestion(text)}
      /> */}

      <DropZone pid={pid} />
    </div>
  )
}
