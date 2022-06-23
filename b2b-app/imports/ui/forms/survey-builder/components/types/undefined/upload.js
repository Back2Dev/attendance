import React from 'react'
import CropOriginalIcon from '@material-ui/icons/CropOriginal'
import { IconButton } from '@material-ui/core'

export const UploadImage = ({ onUploadFinish, index }) => {
  const uploader = new Slingshot.Upload('imageQuestionType', { folder: 'question' }) //question

  const onUpload = async (params) => {
    uploader.send(params, function (error, downloadUrl) {
      if (error) {
        console.error('Error uploading', uploader.xhr.response)
        alert(error)
      }
      // update({ ...item, val: downloadUrl }, index) //update?
      onUploadFinish(downloadUrl)
      // setPropertyByValue({path:path ? `${path}.image` : 'image', value:downloadUrl})
    })
  }

  return (
    <div>
      <label htmlFor={`file-input-${index}`}>
        <IconButton size="small" aria-label="upload" component="span">
          <CropOriginalIcon />
        </IconButton>
      </label>
      <input
        accept="image/*"
        id={`file-input-${index}`}
        onChange={async ({ target: { files } }) => {
          if (files && files[0]) {
            onUpload(files[0])
          }
        }}
        style={{ display: 'none' }}
        type="file"
      />
    </div>
  )
}
