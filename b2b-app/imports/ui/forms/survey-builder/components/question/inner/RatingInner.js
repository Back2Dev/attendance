import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  Box,
  TextField,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
} from '@material-ui/core'
import Rating from '@material-ui/lab/Rating'
import AddIcon from '@material-ui/icons/Add'
import { useBuilder } from '/imports/ui/forms/survey-builder/context'
import { useSelectedPartValue } from '/imports/ui/forms/survey-builder/recoil/hooks'
import { ratingOptions } from '$sb/components/question/field/options'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import SimpleSchema from 'simpl-schema'
import { makeStyles } from '@material-ui/core/styles'
import DragIndicatorIcon from '@material-ui/icons/DragIndicator'
import { OptionList } from '$sb/components/question/field/option-list'

const useStyles = makeStyles(() => ({
  root: {
    position: 'relative',
    paddingLeft: '1.5rem',
    paddingRight: '1.5rem',
    '& .drag-icon': {
      display: 'none',
    },
    '&:hover .drag-icon': {
      display: 'inline',
      position: 'absolute',
      left: '-15px',
      bottom: '3px',
    },
  },
}))

const ratingSchema = new SimpleSchema(
  {
    answers: Array,
    'answers.$': Object,
    'answers.$.id': String,
    'answers.$.name': String,
    'answers.$.type': String,
    'answers.$.max': { type: String, defaultValue: '5' },
  },
  {
    clean: {
      trimStrings: false,
    },
  }
)

const maxOptions = Array.from({ length: 10 }, (_, i) => String(i + 1))

const RatingInner = ({ question, onAnswerChange }) => {
  const classes = useStyles()
  return (
    <Box className={classes.root}>
      <Grid container spacing={3} alignItems="flex-end">
        <Grid item xs={12} md={9} lg={10}>
          <TextField
            fullWidth
            onChange={({ target: { value } }) =>
              onAnswerChange({ aIndex: 0, key: 'name', value })
            }
            value={question.answers[0].name}
            label="Answer"
            placeholder="Type some anwer..."
          />
        </Grid>
        <Grid item xs={12} md={3} lg={2}>
          <TextField
            fullWidth
            onChange={({ target: { value } }) =>
              onAnswerChange({ aIndex: 0, key: 'max', value })
            }
            select
            value={question.answers[0]?.max || '5'}
            label="Max Number"
            placeholder="Select rate..."
          >
            {maxOptions.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>
    </Box>
    // <Droppable droppableId={question.id} type={`question-${question.id}`}>
    //   {(provided) => (
    //     <div ref={provided.innerRef} {...provided.droppableProps}>
    //       {cleanAnswer?.map((answer, aIndex) => {
    //         return (
    //           <Draggable draggableId={answer.id} key={answer.id} index={aIndex}>
    //             {(provided, snapshot) => (
    //               <div key={aIndex} {...provided.draggableProps} ref={provided.innerRef}>
    //                 <Answer
    //                   dragHandleProps={provided.dragHandleProps}
    //                   answer={answer}
    //                   onAnswerChange={onAnswerChange}
    //                   aIndex={aIndex}
    //                 />
    //               </div>
    //             )}
    //           </Draggable>
    //         )
    //       })}
    //       {provided.placeholder}
    //     </div>
    //   )}
    // </Droppable>

    // <Grid container spacing={1} alignItems="flex-start">
    //   <Grid item style={{ visibility: 'hidden' }}>
    //     <RadioButtonUncheckedIcon />
    //   </Grid>
    //   <Grid item xs={3}>
    //     <TextField
    //       id={`${pid}_${0}`}
    //       fullWidth
    //       select
    //       value={question.answers?.[0]?.max}
    //       onChange={({ target: { value } }) =>
    //         setPropertyByValue({
    //           pid,
    //           path: `answers[${0}].max`,
    //           value,
    //         })
    //       }
    //       label="Max Number"
    //       SelectProps={{
    //         native: true,
    //       }}
    //     >
    //       {maxOptions.map((item) => (
    //         <option key={item} value={item}>
    //           {item}
    //         </option>
    //       ))}
    //     </TextField>
    //   </Grid>
    //   <Grid item xs={6}>
    //     <Box component="fieldset" mb={3} borderColor="transparent">
    //       <Rating name={pid} max={Number(question.answers?.[0]?.max) || 1} readOnly />
    //     </Box>
    //   </Grid>

    //   {showMobileActions && (
    //     <Button
    //       variant="outlined"
    //       color="default"
    //       size="small"
    //       startIcon={<AddIcon />}
    //       onClick={() => add()}
    //     >
    //       New item
    //     </Button>
    //   )}
    // </Grid>
  )
}

RatingInner.propTypes = {
  question: PropTypes.object.isRequired,
  onAnswerChange: PropTypes.func,
}

export { RatingInner }

// const Answer = ({ answer, onAnswerChange, aIndex, dragHandleProps }) => {
//   const classes = useStyles()
//   const [showField, setShowField] = useState(() =>
//     Object.keys(ratingOptions).reduce((acc, cur) => {
//       return {
//         ...acc,
//         [cur]: false,
//       }
//     }, {})
//   )

//   const onToggle = (key) => {
//     setShowField({ ...showField, [key]: !showField[key] })
//   }

//   return (
//     <Box className={classes.root}>
//       <Grid container spacing={3} alignItems="flex-end">
//         <IconButton
//           {...dragHandleProps}
//           className="drag-icon"
//           variant="outlined"
//           color="default"
//         >
//           <DragIndicatorIcon />
//         </IconButton>
//         <Grid item xs={12} md={9} lg={10}>
//           <TextField
//             fullWidth
//             onChange={({ target: { value } }) =>
//               onAnswerChange({ aIndex, key: 'name', value })
//             }
//             value={answer.name}
//             InputProps={{
//               // classes: {
//               //   underline: classes.hideUnderline,
//               // },
//               endAdornment: (
//                 <InputAdornment
//                   // classes={{ root: classes.InputAdornment }}
//                   position="end"
//                 >
//                   <OptionList
//                     options={ratingOptions}
//                     onToggle={onToggle}
//                     showField={showField}
//                   />
//                   {/* <UploadImage {...props} /> */}
//                   {/* {specify} */}
//                   {/* {createActions(...actions)} */}
//                 </InputAdornment>
//               ),
//             }}
//             label="Answer"
//             placeholder="Type some anwer..."
//           />
//         </Grid>
//         <Grid item xs={12} md={3} lg={2}>
//           <TextField
//             fullWidth
//             select
//             value={answer.max}
//             onChange={({ target: { value } }) =>
//               onAnswerChange({
//                 aIndex,
//                 key: 'max',
//                 value,
//               })
//             }
//             label="Max Number"
//           >
//             {maxOptions.map((item) => (
//               <MenuItem key={item} value={item}>
//                 {item}
//               </MenuItem>
//             ))}
//           </TextField>
//         </Grid>
//       </Grid>

//       <Grid container spacing={1} alignItems="flex-start">
//         <Grid item xs={8}>
//           {Object.entries(showField)
//             .filter(([_, show]) => show)
//             .map(([key]) => {
//               return (
//                 <TextField
//                   key={key}
//                   fullWidth
//                   value={answer[key] || ''}
//                   onChange={({ target: { value } }) => onAnswerChange({ key, value })}
//                   label={ratingOptions[key]}
//                 />
//               )
//             })}
//         </Grid>
//         <Grid item xs={1}></Grid>
//         <Grid item xs={2}>
//           {/* {answer.image && (
//                             <FieldImage
//                               src={answer.image}
//                               onDeleteImage={() =>
//                                 setPropertyByValue({
//                                   pid,
//                                   path: `answers[${aIndex}].image`,
//                                 })
//                               }
//                             />
//                           )} */}
//         </Grid>
//       </Grid>
//     </Box>
//   )
// }
