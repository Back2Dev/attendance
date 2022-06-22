import React, { useCallback, useMemo, useState, Fragment } from 'react'
import { Grid } from '@material-ui/core'
import { SingleFileUploadWithProgress, UploadError } from './uploadStatus'
import { Tracker } from 'meteor/tracker'
import { useDropzone } from 'react-dropzone'
import {
  useSelectedPartValue,
  usePartAnswers,
} from '/imports/ui/forms/survey-builder/recoil/hooks'
import { useBuilder } from '/imports/ui/forms/survey-builder/context'
import { useTheme } from '@material-ui/core/styles'
import { DndDraggable, DndDroppable } from '/imports/ui/forms/survey-builder/context/dnd'
import { AnswerField, OptionField } from '$sb/components/types/undefined/typesField'
import { partAnswers } from '/imports/ui/forms/survey-builder/recoil/atoms'

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out',
  marginBottom: '0.5rem',
}

const focusedStyle = {
  borderColor: '#2196f3',
}

const acceptStyle = {
  borderColor: '#00e676',
}

const rejectStyle = {
  borderColor: '#ff1744',
}

// aws.config.update({
//   region: Meteor.settings.public.S3_REGION,
//   credentials: new aws.CognitoIdentityCredentials({
//     IdentityPoolId: Meteor.settings.public.S3_IDENTITY_POOL_ID,
//   }),
// })

let currentId = 0

function getNewId() {
  // we could use a fancier solution instead of a sequential ID :)
  return ++currentId
}

// const s3 = new aws.S3({
//   apiVersion: "2006-03-01",
//   params: { Bucket: Meteor.settings.public.S3_BUCKET_NAME }
// });

export const UploadInner = ({ pid, part, setPropertyByValue }) => {
  const { add, remove } = usePartAnswers(pid)
  const selectedPart = useSelectedPartValue()
  const { isMobile } = useBuilder()
  const showMobileActions = isMobile && selectedPart === pid
  const theme = useTheme()

  const getStyle = (style, snapshot, lockAxis) => {
    if (!snapshot.isDragging) return style
    return {
      ...lockAxis('y', style),
      boxShadow: theme.shadows[3],
      background: theme.palette.background.paper,
    }
  }
  const [isIdChecked, setIsIdChecked] = useState({})

  const [files, setFiles] = useState([])

  const uploader = new Slingshot.Upload('uploadQuestionType', { folder: 'question' })

  const onDelete = (file) => {
    Meteor.call('s3.deleteObject', { fileName: file.name }, () => {
      setFiles((current) => current.filter((f) => f.file !== file))
      // setProperty([...property].filter((f) => f.name !== file.name))
    })

    // Option: delete file directly from client-side with Cognito + Identity Pool(unAuth)
    // s3.deleteObject({ Key: file.name }, function(err, data) {
    //   if (err) {
    //     return alert("There was an error deleting your file: ", err.message);
    //   }
    // });
  }

  const onUpload = (params, setProgress, answerIndex) => {
    uploader.send(params, function (error, downloadUrl) {
      if (error) {
        console.error('Error uploading', uploader.xhr.response)
        alert(error)
      } else {
        //For multiple upload, the downloadUrl always return the same??
        setPropertyByValue({
          pid,
          path: `answers[${answerIndex}].type`,
          value: downloadUrl,
        })
      }

      Tracker.autorun(() => {
        setProgress(uploader.progress() * 100)
      })
    })

    // Option: upload file directly from client-side with Cognito + Identity Pool(unAuth)
    // const upload = new aws.S3.ManagedUpload({
    //   params: {
    //     Bucket: 'back2bike',
    //     Key: params.name,
    //     Body: params,
    //   },
    // })

    // const promise = upload.on('httpUploadProgress', function(progress) {
    //   let progressPercentage = Math.round(progress.loaded / progress.total * 100);
    //   setProgress(progressPercentage)

    // }).promise()

    // return promise.then(
    //   function (data) {
    //     console.log('S3 response', data)
    //     setProperty([...property,  {name: data.key, url: data.Location}])

    //   },
    //   function (err) {
    //     console.log(err)
    //     return alert('There was an error uploading your photo: ', err.message)
    //   }
    // )
  }

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    console.log('accept', acceptedFiles)
    console.log('reject', rejectedFiles)

    const mappedAcc = acceptedFiles.map((file) => ({ file, errors: [], id: getNewId() }))
    const mappedRej = rejectedFiles.map((r) => ({ ...r, id: getNewId() }))
    setFiles((curr) => [...curr, ...mappedAcc, ...mappedRej])
  }, [])

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isFocused,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    accept: ['.pdf', 'image/*', '.txt', 'video/*'],
    maxSize: 100 * 1024 * 1024,
    multiple: false, //allow one file to be uploaded one time
    maxFiles: 1,
  })

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  )

  return (
    <div>
      <DndDroppable pid={pid} listAtom={partAnswers(pid)} type={pid}>
        {(provided) => (
          <ul
            style={{ paddingLeft: 0 }}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {part?.answers?.map((answer, answerIndex) => {
              return (
                <DndDraggable
                  pid={pid}
                  itemId={answer.id || answer._id}
                  index={answerIndex}
                  key={answer.id || answer._id || `${pid}_${answerIndex}`}
                >
                  {(provided, snapshot, lockAxis) => (
                    <div
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getStyle(provided.draggableProps.style, snapshot, lockAxis)}
                      ref={provided.innerRef}
                    >
                      <AnswerField
                        underline={true}
                        onRemove={() => remove(answerIndex)}
                        onAdd={() => add(answerIndex)}
                        disableRemove={part.answers.length === 1}
                        setPropertyByValue={setPropertyByValue}
                        pid={pid}
                        answer={answer}
                        answerIndex={answerIndex}
                        showMobileActions={showMobileActions}
                        part={part}
                        isIdChecked={isIdChecked}
                        setIsIdChecked={setIsIdChecked}
                        options={[]}
                      />

                      <Grid item>
                        <div {...getRootProps({ style })}>
                          <input {...getInputProps()} />
                          {isDragActive ? (
                            <p>Drop the files here ...</p>
                          ) : (
                            <p>Drag 'n' drop some files here, or click to select files</p>
                          )}
                        </div>
                      </Grid>

                      {files.map((fileWrapper) => (
                        <Grid item key={fileWrapper.id}>
                          {fileWrapper.errors.length ? (
                            <UploadError
                              file={fileWrapper.file}
                              errors={fileWrapper.errors}
                              onDelete={onDelete}
                            />
                          ) : (
                            <SingleFileUploadWithProgress
                              onDelete={onDelete}
                              onUpload={onUpload}
                              answerIndex={answerIndex}
                              file={fileWrapper.file}
                            />
                          )}
                        </Grid>
                      ))}
                      {/* <AnswerField
                        underline={true}
                        onRemove={() => remove(answerIndex)}
                        onAdd={() => add(answerIndex)}
                        disableRemove={part.answers.length === 1}
                        setPropertyByValue={setPropertyByValue}
                        pid={pid}
                        answer={answer}
                        answerIndex={answerIndex}
                        showMobileActions={showMobileActions}
                        part={part}
                        isIdChecked={isIdChecked}
                        setIsIdChecked={setIsIdChecked}
                        options={textOptions}
                        type={'text'}
                      />
                   
                      <Grid container spacing={1} alignItems="flex-start">
                        <Grid item xs={8}>
                          <OptionField
                            part={part.answers[answerIndex]}
                            filterList={[...filterList]}
                            setPropertyByValue={setPropertyByValue}
                            isIdChecked={isIdChecked}
                            setIsIdChecked={setIsIdChecked}
                            showMobileActions={showMobileActions}
                            pid={pid}
                            path={`answers[${answerIndex}]`}
                          />
                        </Grid>
                        <Grid item xs={1}>
                          {' '}
                        </Grid>
                        <Grid item xs={2}>
                          <img
                            src={answer.image}
                            loading="lazy"
                            style={{
                              borderBottomLeftRadius: 4,
                              borderBottomRightRadius: 4,
                              display: 'block',
                              width: '200px',
                            }}
                          />
                        </Grid>
                      </Grid> */}
                    </div>
                  )}
                </DndDraggable>
              )
            })}
            {provided.placeholder}
          </ul>
        )}
      </DndDroppable>

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
