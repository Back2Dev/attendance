import React, { useCallback, useMemo, useState, Fragment } from 'react'
import { useDropzone } from 'react-dropzone'
import { useRecoilState } from 'recoil'
import { editInspectorState } from '/imports/ui/forms/survey-builder/recoil/atoms'
import { Grid } from '@material-ui/core'
import { SingleFileUploadWithProgress, UploadError } from './uploadStatus'
import { useRecoilValue } from 'recoil'
import { uploadAnswersAccept } from '/imports/ui/forms/survey-builder/recoil/atoms'
import { Tracker } from 'meteor/tracker'
import { useQuestion } from '/imports/ui/forms/survey-builder/recoil/hooks'
// import { deleteFile } from '/imports/api/s3-utils'

// const aws = require('aws-sdk')

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

export const DropZone = ({ pid }) => {
  const [property, setProperty] = useRecoilState(
    editInspectorState({ pid, path: 'answers' })
  )
  const { accept, maxFiles, maxSize } = useRecoilValue(uploadAnswersAccept(pid))
  const [files, setFiles] = useState([])
  const [question] = useQuestion(pid)

  const uploader = new Slingshot.Upload('uploadQuestionType', { folder: question })

  const onDelete = (file) => {
    Meteor.call('s3.deleteObject', { fileName: file.name }, () => {
      setFiles((current) => current.filter((f) => f.file !== file))
      setProperty([...property].filter((f) => f.name !== file.name))
    })

    // Option: delete file directly from client-side with Cognito + Identity Pool(unAuth)
    // s3.deleteObject({ Key: file.name }, function(err, data) {
    //   if (err) {
    //     return alert("There was an error deleting your file: ", err.message);
    //   }
    // });
  }

  const onUpload = (params, setProgress) => {
    uploader.send(params, function (error, downloadUrl) {
      if (error) {
        console.error('Error uploading', uploader.xhr.response)
        alert(error)
      } else {
        //For multiple upload, the downloadUrl always return the same??
        setProperty((property) => [...property, { name: params.name, url: downloadUrl }])
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
    accept: [...accept],
    maxSize: maxSize * 1024 * 1024,
    multiple: false, //allow one file to be uploaded one time
    maxFiles,
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
        <div {...getRootProps({ style })} name={pid} key={pid}>
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
