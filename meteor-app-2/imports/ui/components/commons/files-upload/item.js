/* global Slingshot */
import { Tracker } from 'meteor/tracker'
import React, { useState, useMemo, useEffect } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { LinearProgress, IconButton, Typography } from '@material-ui/core'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever'

import { showError } from '/imports/ui/utils/toast-alerts'

const StyledFileUploadItem = styled.div`
  position: relative;
  padding-right: 30px;
  .progress-bar {
    width: 100%;
  }
  .delete-btn {
    position: absolute;
    top: 0;
    right: 0;
  }
  .file-info {
    font-family: 'GothamRoundedMedium';
  }
`

function FileUploadItem({
  fileId,
  file,
  metaContext = {},
  onRemove,
  onUploaded,
  addIdToName = true,
  uploadNow,
  setDragged,
}) {
  const [progress, setProgress] = useState(0)

  if (!metaContext.fileName) {
    metaContext.fileName = addIdToName ? `${file.name}-${fileId}` : file.name
  }

  const uploader = useMemo(() => new Slingshot.Upload('documentUploads', metaContext), [
    file,
    metaContext,
  ])

  useEffect(() => {
    if (uploadNow) {
      uploader.send(file, function (error, downloadUrl) {
        if (error) {
          showError(error.message)
          // console.log('Error uploading', error)
        } else {
          onUploaded(fileId, downloadUrl)
        }
      })
      Tracker.autorun(() => {
        // console.log('updating status')
        setProgress(uploader.progress() * 100)
      })
    }
  }, [file, uploadNow])

  const renderFileSize = (sizeInBytes) => {
    if (sizeInBytes < 1024) {
      return `${sizeInBytes} bytes`
    }
    if (sizeInBytes < 1024 * 1024) {
      return `${Math.round((sizeInBytes / 1024 + Number.EPSILON) * 100) / 100} kB`
    }
    if (sizeInBytes < 1024 * 1024 * 1024) {
      return `${
        Math.round((sizeInBytes / (1024 * 1024) + Number.EPSILON) * 100) / 100
      } MB`
    }
  }

  return (
    <StyledFileUploadItem>
      <Typography className="file-info">
        {file.path} - {renderFileSize(file.size)}
      </Typography>
      <LinearProgress className="progress-bar" variant="determinate" value={progress} />
      <IconButton
        size="small"
        className="delete-btn"
        onClick={() => {
          onRemove(fileId)
          setDragged(false)
        }}
      >
        <DeleteForeverIcon size="small" />
      </IconButton>
    </StyledFileUploadItem>
  )
}

FileUploadItem.propTypes = {
  fileId: PropTypes.string.isRequired,
  file: PropTypes.shape({
    path: PropTypes.string,
    size: PropTypes.number,
    name: PropTypes.string,
  }).isRequired,
  metaContext: PropTypes.object,
  onRemove: PropTypes.func.isRequired,
  onUploaded: PropTypes.func.isRequired,
  addIdToName: PropTypes.bool,
  uploadNow: PropTypes.bool,
}

export default FileUploadItem
