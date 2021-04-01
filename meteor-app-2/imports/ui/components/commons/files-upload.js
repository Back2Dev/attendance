import { Random } from 'meteor/random'
import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useDropzone } from 'react-dropzone'
import styled from 'styled-components'
import { Paper, ButtonBase } from '@material-ui/core'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import FileUploadItem from './files-upload/item'
import { showSuccess } from '/imports/ui/utils/toast-alerts'

const StyledFilesUpload = styled.div`
  margin-bottom: 20px;
  .dropzone {
    margin-top: 5px;
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
    border: 3px dotted #aeafb0;
  }
  .dz-normal .description {
    color: #aeafb0;
  }
  .dz-dragged {
    border: 3px dotted #4794fc;
    opacity: 0.7;
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
`

function FilesUpload({
  maxFiles = 1,
  accept = '*.*',
  description,
  metaContext,
  onChange,
  addIdToName,
  uploadNow = true,
  back = false,
}) {
  const [allAcceptedFiles, setAllAcceptedFiles] = useState([])
  const [dragged, setDragged] = useState(false)

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept,
    maxFiles: maxFiles - allAcceptedFiles.length,
  })

  const { goBack } = useHistory()

  useEffect(() => {
    onChange(allAcceptedFiles)
  }, [allAcceptedFiles])

  // push these file to all Accepted files
  useEffect(() => {
    if (allAcceptedFiles.length >= maxFiles) {
      return
    }

    const newAllAcceptedFiles = [...allAcceptedFiles]
    acceptedFiles.forEach((file) => {
      const existing = allAcceptedFiles.some((item) => item.file.path === file.path)
      if (!existing && newAllAcceptedFiles.length < maxFiles) {
        const { name, size, type } = file
        newAllAcceptedFiles.push({
          _id: Random.id(),
          file,
          name,
          size,
          type,
        })
      }
    })
    setAllAcceptedFiles(newAllAcceptedFiles)
  }, [acceptedFiles])

  const removeFileItem = (fileId) => {
    const newAllAcceptedFiles = []
    allAcceptedFiles.forEach((item) => {
      if (item._id !== fileId) {
        newAllAcceptedFiles.push(item)
      }
    })
    setAllAcceptedFiles(newAllAcceptedFiles)
  }

  const onFileUploaded = (fileId, downloadUrl) => {
    const newAllAcceptedFiles = [...allAcceptedFiles]
    newAllAcceptedFiles.map((item) => {
      if (item._id === fileId) {
        item.downloadUrl = downloadUrl
      }
    })
    setAllAcceptedFiles(newAllAcceptedFiles)
    if (back) {
      showSuccess('Success! Your file was uploaded')
      // slightly delay going back to let user see that it's uploaded
      setTimeout(() => goBack(), 1000)
    }
  }

  const defaultDescription = `Click or drag ${
    maxFiles === 1 ? 'file' : 'files'
  } to this area to upload`

  const renderFiles = () => {
    if (!allAcceptedFiles.length) {
      return null
    }
    return (
      <ul>
        {allAcceptedFiles.map((item) => (
          <li key={item._id}>
            <FileUploadItem
              fileId={item._id}
              file={item.file}
              metaContext={metaContext}
              onRemove={removeFileItem}
              onUploaded={onFileUploaded}
              addIdToName={addIdToName}
              uploadNow={uploadNow}
              setDragged={setDragged}
            />
          </li>
        ))}
      </ul>
    )
  }

  const renderUploadBtn = () => {
    if (allAcceptedFiles.length >= maxFiles) {
      return null
    }
    return (
      <Paper
        elevation={0}
        {...getRootProps({
          className: dragged ? 'dropzone dz-dragged' : 'dropzone dz-normal',
          onDragOver: () => setDragged(true),
          onDragLeave: () => setDragged(false),
        })}
      >
        <input
          data-cy="upload-input"
          {...getInputProps()}
          multiple={maxFiles === 1 ? false : true}
        />
        <ButtonBase component="div" className="button">
          <div className="description">
            <CloudUploadIcon style={{ fontSize: '50px', width: '100%' }} />
            {description || defaultDescription}
          </div>
        </ButtonBase>
      </Paper>
    )
  }

  return (
    <StyledFilesUpload>
      {renderUploadBtn()}
      <div className="files-upload">{renderFiles()}</div>
    </StyledFilesUpload>
  )
}

FilesUpload.propTypes = {
  maxFiles: PropTypes.number,
  accept: PropTypes.string,
  description: PropTypes.string,
  metaContext: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  addIdToName: PropTypes.bool,
  uploadNow: PropTypes.bool,
  back: PropTypes.bool,
}

export default FilesUpload
