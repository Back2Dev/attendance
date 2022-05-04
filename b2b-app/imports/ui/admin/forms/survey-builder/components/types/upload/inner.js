import React from 'react'
import {  useUploadQuestion } from '$sb/recoil/hooks'
import { Question } from '$sb/components/question'
import {DropZone} from './item'


export const InnerUpload = ({ pid }) => {
  const [question, setQuestion] = useUploadQuestion(pid)
 
  return (
    <div>
      <Question
        placeholder="Type your question"
        label={question}
        onLabelChange={(text) => setQuestion(text)}
      />

    <DropZone pid={pid} />

    </div>
  )
}
