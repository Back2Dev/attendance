import React from 'react'
import PropTypes from 'prop-types'
import { useDropzone } from 'react-dropzone'
import { Button, makeStyles } from '@material-ui/core'
import slingshotUpload from '/imports/ui/components/upload-function'

const debug = require('debug')('app:upload')

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    maxWidth: 500,
  },
  dropzone: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderWidth: '2px',
    borderRadius: '2px',
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border 0.24s ease-in-out',
  },
})

const FileUploader = ({ metaContext, handleMethod }) => {
  const [file, setFile] = React.useState({})

  const classes = useStyles()

  const upload = async () => {
    const upload = slingshotUpload({ metaContext, file })

    if (upload.status === 'success') {
      handleMethod()
      debug('done')
    }
  }

  const onDrop = React.useCallback((acceptedFiles) => {
    acceptedFiles.forEach((doc) => {
      setFile(doc)
    })
  }, [])

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'application/pdf',
    onDrop,
  })

  return (
    <>
      <div {...getRootProps({ className: classes.dropzone })}>
        <input {...getInputProps()} data-cy="uploader" />
        <p>Drag 'n' drop a file here, or click to select a file</p>
      </div>
      <br></br>
      <div>
        File:
        <ul>
          {Object.keys(file).length > 0 ? (
            <li key={file.name}>
              {file.name} - {Math.round(file.size / 1000)} kb{' '}
            </li>
          ) : null}
        </ul>
      </div>

      <div>
        <Button
          onClick={() => upload()}
          data-cy="submit-uploader"
          disabled={!Object.keys(file).length > 0}
          color="primary"
          variant="contained"
        >
          Upload File
        </Button>{' '}
        <Button
          onClick={() => {
            setFile({})
          }}
        >
          Clear
        </Button>
      </div>
    </>
  )
}

FileUploader.propTypes = {
  metaContext: PropTypes.object.isRequired,
  handleMethod: PropTypes.func.isRequired,
}

export default FileUploader
