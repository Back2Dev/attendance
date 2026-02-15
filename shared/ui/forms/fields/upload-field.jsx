import React, { useCallback, useMemo, useState, Fragment, useEffect } from 'react'
import { Meteor } from 'meteor/meteor'
import { Random } from 'meteor/random'
import { Tracker } from 'meteor/tracker'
import { useDropzone } from 'react-dropzone'
import { connectField, filterDOMProps } from 'uniforms'
import { ErrorField } from 'uniforms-mui'
import {
  LinearProgress,
  Typography,
  ButtonBase,
  Grid,
  Button,
  Paper,
} from '@mui/material'
import { withStyles } from '@mui/styles'
import { styled } from '@mui/material/styles'
import { createStyles } from '@mui/styles'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import CancelIcon from '@mui/icons-material/Cancel'
import DocIcon from '@mui/icons-material/TextSnippetOutlined'
import RestoreIcon from '@mui/icons-material/Replay'
import Chip from '@mui/material/Chip'
import CONSTANTS from '/imports/api/constants'
import dbg from 'debug'
import { file } from 'jszip'
const debug = dbg('app:upload-field')

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#cb1b33',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out',
}

const focusedStyle = {
  borderColor: '#cb1b33',
}

const acceptStyle = {
  borderColor: '#cb1b33',
}

const rejectStyle = {
  borderColor: '#ff1744',
}

const StyledFilesUpload = styled('div')`
  margin-bottom: 20px;
  .dropzone {
    border-radius: 15px;
    .button {
      padding: 40px;
      width: 100%;
    }
    &:focus {
      outline: none;
    }
  }
  .dz-normal {
    border: 3px dashed #cb1b33;
    opacity: 0.5;
  }
  .dz-normal .description {
    color: #aeafb0;
  }
  .dz-dragged {
    border: 3px dashed #cb1b33;
    opacity: 1;
  }
  .dz-dragged .description {
    color: #4794fc;
  }
  .description {
    font-family: 'GothamRoundedMedium';
    text-align: center;
  }
  .files-upload {
    ul {
      padding-left: 23px;
      li {
        margin-bottom: 5px;
      }
    }
  }
  .thumbnail {
    max-width: 250px;
  }
`

let currentId = 0

function getNewId() {
  return Random.id()
}

const ExistingFiles = ({ files, remove, restore }) => {
  return (
    <>
      {files.length > 0 && (
        <Paper sx={{ margin: '0 40px 0 40px', padding: '8px' }}>
          <p>You have uploaded the following files: </p>
          {files.map((file) => (
            <span key={file.id}>
              <Chip
                sx={{
                  height: 'auto',
                  '& .MuiChip-label': {
                    display: 'block',
                    whiteSpace: 'normal',
                  },
                  margin: '4px',
                }}
                variant="outlined"
                color={file.removed ? 'error' : 'primary'}
                key={file.id}
                id={file.id}
                title={!file.removed ? 'Remove this file' : 'Restore this file'}
                deleteIcon={file.removed ? <RestoreIcon /> : null}
                icon={<DocIcon />}
                label={`${file.name} (${file.size})`}
                onDelete={() => remove(file.id)}
              />
              &nbsp;
            </span>
          ))}
        </Paper>
      )}
    </>
  )
}

const UploadField = ({
  onChange,
  accept = CONSTANTS.UPLOAD_ACCEPT_FILES,
  maxSize = 100,
  value = [],
}) => {
  const [files, setFiles] = useState([])
  const [existing, setExisting] = useState(value)
  const [dragged, setDragged] = useState(false)
  const [newFiles, setNewFiles] = useState([])
  const metaContext = {
    folder: 'uploads',
    fileName: 'upload.pdf',
  }
  const uploader = new Slingshot.Upload('documentUploads', metaContext)
  const onDelete = (file) => {
    Meteor.call('s3.deleteObject', { fileName: file.name }, () => {
      setFiles((current) => current.filter((f) => f.file !== file))
    })
    debug('Removed upload', file)
  }

  const uploadQ = []

  const sendNextFile = (params, setProgress) => {
    uploader.send(params, function (error, downloadUrl) {
      if (error) {
        debug('Error uploading file: ', downloadUrl)
        const file = files.find((f) => downloadUrl === f.id)

        if (file) file.errors.push({ message: error.message, code: 'upload-fail' })
        else console.log(`Could not find file with id ${downloadUrl}`)
        console.error(error)
      } else {
        metaContext.id = params.id
        const url = downloadUrl.replace(/http[s]*:\/\/.*?\/.*?\//, '')
        const fileData = {
          path: params.path,
          lastModified: params.lastModified,
          name: params.name,
          size: params.size,
          type: params.type,
          url: url.replace(/^\//, ''),
          id: params.id,
        }
        debug(`Uploaded file: ${downloadUrl}`, fileData)
        let newToBeUploaded = [...newFiles]
        // Keep if not removed and it has a URL
        if (!newFiles.length) newToBeUploaded = [...existing]
        newToBeUploaded.push(fileData)
        setNewFiles(newToBeUploaded)
        //  newFiles = files.concat([fileData]).concat(existing)
        // .filter((f) => !f.removed && f.url)

        onChange(newToBeUploaded.filter((f) => !f.removed && f.url))
      }

      Tracker.autorun(() => {
        setProgress(uploader.progress() * 100)
      })
      // Look for the next file to send
      uploadQ.shift()
      if (uploadQ.length >= 1) {
        const { parameters, setP } = uploadQ[0]
        sendNextFile(parameters, setP)
      }
    })
  }

  const onUpload = (params, setProgress) => {
    debug(`Queueing file for upload: ${params.id}/${params.name}`)
    uploadQ.push({ parameters: params, setP: setProgress })
    if (uploadQ.length === 1) {
      const { parameters, setP } = uploadQ[0]
      sendNextFile(parameters, setP)
    }
  }

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    console.log('accept', acceptedFiles)
    console.log('reject', rejectedFiles)

    const mappedAcc = acceptedFiles.map((file) => {
      file.id = getNewId()
      return { file, errors: [], id: file.id }
    })
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
    multiple: true,
    maxFiles: 10,
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

  const rmExisting = (id) => {
    debug(`Delete file ${id}`)
    setExisting(
      existing.map((file) => {
        if (file.id === id) {
          file.removed = !file.removed
        }
        return file
      })
    )
  }

  const restoreExisting = () => {
    debug(`Restoring files`)
    setExisting(
      existing.map((file) => {
        delete file.removed
        return file
      })
    )
  }

  return (
    <div>
      <ExistingFiles files={existing} remove={rmExisting} restore={restoreExisting} />
      <p>You may upload additional files below: </p>

      <Grid item key="111">
        <StyledFilesUpload>
          <div
            {...getRootProps({
              // style,
              className: dragged ? 'dropzone dz-dragged' : 'dropzone dz-normal',
              onDragOver: () => setDragged(true),
              onDragLeave: () => setDragged(false),
            })}
          >
            <input {...getInputProps()} data-cy="upload" />

            <ButtonBase component="div" className="button">
              <div
                className="description"
                style={{
                  color: '#cb1b33',
                  opacity: 0.5,
                }}
              >
                <CloudUploadIcon
                  style={{
                    fontSize: '50px',
                    width: '100%',
                  }}
                />
                {isDragActive ? (
                  <p>Drop the files here ...</p>
                ) : (
                  <p>Drag 'n' drop some files here, or click to select files</p>
                )}
              </div>
            </ButtonBase>
          </div>
        </StyledFilesUpload>
        <ErrorField name="upload" children={<span>Required</span>} />
      </Grid>

      {files.length > 0 && <p>Files you uploaded this time</p>}

      <div display="flex" style={{ alignContent: 'space-around' }}>
        {files.map((fileWrapper, ix) =>
          fileWrapper.errors?.length ? (
            <UploadError
              key={fileWrapper.id}
              file={fileWrapper.file}
              errors={fileWrapper.errors}
              onDelete={onDelete}
            />
          ) : (
            <UploadedFile
              key={fileWrapper.id}
              onDelete={onDelete}
              onUpload={onUpload}
              file={fileWrapper.file}
            />
          )
        )}
      </div>

      <p>&nbsp;</p>
    </div>
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
      <FileHeader file={file} onDelete={onDelete} error />
      <ErrorLinearProgress variant="determinate" value={100} />
      {errors.map((error) => (
        <div key={error.code}>
          <Typography color="error">{error.message}</Typography>
        </div>
      ))}
    </React.Fragment>
  )
}

export function FileHeader({ file, onDelete, error }) {
  return (
    <Grid container justify="space-between" alignItems="center">
      <Grid item style={{ color: error ? 'red' : 'green' }}>
        {file.name}
      </Grid>
      <Grid item>
        <Button size="small" onClick={() => onDelete(file)}>
          <CancelIcon />
          Remove
        </Button>
      </Grid>
    </Grid>
  )
}

export function UploadedFile({ file, onDelete, onUpload, answerIndex }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    onUpload(file, setProgress, answerIndex)
  }, [])

  return (
    <div
      style={{
        flexGrow: 0,
        display: 'inline-block',
        padding: '8px',
        textAlign: 'center',
      }}
    >
      <Chip
        sx={{
          height: 'auto',
          '& .MuiChip-label': {
            display: 'block',
            whiteSpace: 'normal',
          },
          marginBottom: '2px',
        }}
        variant="outlined"
        color={'primary'}
        icon={<DocIcon />}
        label={file.name}
        onDelete={() => onDelete(file)}
      ></Chip>
      {/* <FileHeader file={file} onDelete={onDelete} /> */}
      <LinearProgress
        data-cy={`progress-${progress}-${file.name}`}
        variant="determinate"
        value={progress}
        color="success"
        sx={{ paddingLeft: '2px', paddingRight: '2px' }}
      />
    </div>
  )
}

export default connectField(UploadField, { kind: 'leaf' })
