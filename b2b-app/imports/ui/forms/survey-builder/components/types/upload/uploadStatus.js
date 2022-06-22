import {
  createStyles,
  LinearProgress,
  Typography,
  withStyles,
  Grid,
  Button,
} from '@material-ui/core'
import React, { useState, useEffect } from 'react'

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
