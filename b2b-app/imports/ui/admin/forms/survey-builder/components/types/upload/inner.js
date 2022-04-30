import React from 'react'
// import { DndDraggable, DndDroppable } from '$sb/context/dnd'
// import { useTheme } from '@material-ui/core/styles'
// import { Box } from '@material-ui/core'
import { useUploadAnswers, useUploadQuestion, useSelectedPartValue } from '$sb/recoil/hooks'
// import { Item } from './item'
// import { useBuilder } from '$sb/context'
// import { imageAnswers } from '$sb/recoil/atoms'
import { uploadAnswersAccept } from '$sb/recoil/atoms'
import { Question } from '$sb/components/question'
// import {useDropzone} from 'react-dropzone'
import {DropZone} from './item'
import { useRecoilValue } from 'recoil'

export const InnerUpload = ({ pid }) => {
  const { all, add, update, remove } = useUploadAnswers(pid)
  const fileRestriction = useRecoilValue(uploadAnswersAccept(pid))
  // const theme = useTheme()
  const [question, setQuestion] = useUploadQuestion(pid)
  const selectedPart = useSelectedPartValue()
  // const { isMobile } = useBuilder()

  console.log(fileRestriction)
  

  // console.log('selectedPart',selectedPart)
  // const getStyle = (style, snapshot, lockAxis) => {
  //   if (!snapshot.isDragging) return style
  //   return {
  //     ...lockAxis('y', style),
  //     boxShadow: theme.shadows[3],
  //     background: theme.palette.background.paper,
  //   }
  // }


  // const showMobileActions = isMobile && selectedPart === pid

  return (
    <div>
      <Question
        placeholder="Type your question"
        label={question}
        onLabelChange={(text) => setQuestion(text)}
      />

    <DropZone pid={pid} all={all} fileRestriction={fileRestriction}/>

    </div>
  )
}
