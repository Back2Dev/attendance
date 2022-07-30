// import React from 'react'
// import PropTypes from 'prop-types'
// import { useDropzone } from 'react-dropzone'
// import { Button, makeStyles } from '@material-ui/core'
// import slingshotUpload from '/imports/ui/components/upload-function'

// const debug = require('debug')('app:upload')

// const useStyles = makeStyles({
//   root: {
//     flexGrow: 1,
//     maxWidth: 500,
//   },
//   dropzone: {
//     flex: 1,
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     padding: '20px',
//     borderWidth: '2px',
//     borderRadius: '2px',
//     borderColor: '#eeeeee',
//     borderStyle: 'dashed',
//     backgroundColor: '#fafafa',
//     color: '#bdbdbd',
//     outline: 'none',
//     transition: 'border 0.24s ease-in-out',
//   },
// })

// const FileUploader = ({ metaContext, handleMethod }) => {
//   const [file, setFile] = React.useState({})

//   const classes = useStyles()

//   const upload = async () => {
//     const upload = slingshotUpload({ metaContext, file })

//     if (upload.status === 'success') {
//       handleMethod()
//       debug('done')
//     }
//   }

//   const onDrop = React.useCallback((acceptedFiles) => {
//     acceptedFiles.forEach((doc) => {
//       setFile(doc)
//     })
//   }, [])

//   const { getRootProps, getInputProps } = useDropzone({
//     accept: 'application/pdf',
//     onDrop,
//   })

//   return (
//     <>
//       <div {...getRootProps({ className: classes.dropzone })}>
//         <input {...getInputProps()} data-cy="uploader" />
//         <p>Drag 'n' drop a file here, or click to select a file</p>
//       </div>
//       <br></br>
//       <div>
//         File:
//         <ul>
//           {Object.keys(file).length > 0 ? (
//             <li key={file.name}>
//               {file.name} - {Math.round(file.size / 1000)} kb{' '}
//             </li>
//           ) : null}
//         </ul>
//       </div>

//       <div>
//         <Button
//           onClick={() => upload()}
//           data-cy="submit-uploader"
//           disabled={!Object.keys(file).length > 0}
//           color="primary"
//           variant="contained"
//         >
//           Upload File
//         </Button>{' '}
//         <Button
//           onClick={() => {
//             setFile({})
//           }}
//         >
//           Clear
//         </Button>
//       </div>
//     </>
//   )
// }

// FileUploader.propTypes = {
//   metaContext: PropTypes.object.isRequired,
//   handleMethod: PropTypes.func.isRequired,
// }

// export default FileUploader

import React, { useCallback, useMemo, useState, Fragment, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { Tracker } from 'meteor/tracker'
import {
  createStyles,
  LinearProgress,
  Typography,
  withStyles,
  Grid,
  Button,
} from '@material-ui/core'

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

let currentId = 0

function getNewId() {
  // we could use a fancier solution instead of a sequential ID :)
  return ++currentId
}

export const UploadField = ({ accept, maxSize = 100, onChange }) => {
  const [files, setFiles] = useState([])
  const uploader = new Slingshot.Upload('uploadQuestionType', { folder: 'question' })

  const onDelete = (file) => {
    Meteor.call('s3.deleteObject', { fileName: file.name }, () => {
      setFiles((current) => current.filter((f) => f.file !== file))
    })
  }

  const onUpload = (params, setProgress) => {
    uploader.send(params, function (error, downloadUrl) {
      if (error) {
        console.error('Error uploading', uploader.xhr.response)
        alert(error)
      } else {
        //For multiple upload, the downloadUrl always return the same??
        onChange(downloadUrl)
      }

      Tracker.autorun(() => {
        setProgress(uploader.progress() * 100)
      })
    })
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
    accept: Object.keys(accept).filter((type) => accept[type]) || [],
    maxSize: maxSize * 1024 * 1024,
    multiple: false,
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
    <Fragment>
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
              file={fileWrapper.file}
            />
          )}
        </Grid>
      ))}
    </Fragment>
  )
}

const ErrorLinearProgress = withStyles((theme) =>
  createStyles({
    bar: {
      backgroundColor: theme.palette.error.main,
    },
  })
)(LinearProgress)

export function UploadError({ file, onDelete, errors }) {
  return (
    <React.Fragment>
      <FileHeader file={file} onDelete={onDelete} />
      <ErrorLinearProgress variant="determinate" value={100} />
      {errors.map((error) => (
        <div key={error.code}>
          <Typography color="error">{error.message}</Typography>
        </div>
      ))}
    </React.Fragment>
  )
}

export function FileHeader({ file, onDelete }) {
  return (
    <Grid container justify="space-between" alignItems="center">
      <Grid item>{file.name}</Grid>
      <Grid item>
        <Button size="small" onClick={() => onDelete(file)}>
          Delete
        </Button>
      </Grid>
    </Grid>
  )
}

export function SingleFileUploadWithProgress({ file, onDelete, onUpload, answerIndex }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    onUpload(file, setProgress, answerIndex)
  }, [])

  return (
    <Grid item>
      <FileHeader file={file} onDelete={onDelete} />
      <LinearProgress variant="determinate" value={progress} />
    </Grid>
  )
}
