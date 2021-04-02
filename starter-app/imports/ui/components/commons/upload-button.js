import { Random } from 'meteor/random'
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useDropzone } from 'react-dropzone'
import styled from 'styled-components'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import { ButtonBase, Button } from '@material-ui/core'

import FileUploadItem from './files-upload/item'

const StyledFilesUpload = styled.div`
  .dropzone {
    background: #f1f1f1;
    .button {
      padding: 10px;
      width: 100%;
    }
    &:focus {
      outline: none;
    }
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
}) {
  const [allAcceptedFiles, setAllAcceptedFiles] = useState([])

  const { acceptedFiles, getRootProps, getInputProps, open } = useDropzone({
    accept,
    maxFiles: maxFiles - allAcceptedFiles.length,
  })

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
              uploadNow={true}
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
      <Button
        variant="contained"
        color="primary"
        startIcon={<CloudUploadIcon />}
        onClick={open}
      >
        <input {...getInputProps()} data-cy={`upload-btn`} />
        <ButtonBase component="div" className="button">
          <div className="description">{description || defaultDescription}</div>
        </ButtonBase>
      </Button>
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
}

export default FilesUpload
