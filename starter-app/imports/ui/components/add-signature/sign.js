import React from 'react'
import SignatureCanvas from 'react-signature-canvas'
import { Button, Paper, Typography, Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  mobile: {
    marginTop: '10px',
  },
  sigImage: {
    backgroundSize: '220px 60px',
    width: '200px',
    height: '50px',
    backgroundColor: 'white',
    border: '2px solid green',
  },
}))

export default Sign = () => {
  const [dataURL, setDataURL] = React.useState(null)
  const sigRef = React.useRef()
  const classes = useStyles()

  const trim = () => {
    if (sigRef.current) {
      setDataURL(sigRef.current.getTrimmedCanvas().toDataURL('image/jpg'))
    }
  }

  const clear = () => {
    sigRef.current && sigRef.current.clear()
  }

  return (
    <div>
      Sign here<br></br>
      <Paper>
        <SignatureCanvas
          ref={sigRef}
          penColor="green"
          canvasProps={{ width: 500, height: 200, className: 'sigCanvas' }}
        />
      </Paper>
      <div>
        <Button onClick={clear}>Clear</Button>&nbsp; &nbsp;
        <Button onClick={trim}>Save</Button>
      </div>
      {dataURL && (
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Typography variant="h6">Signature</Typography>
            <img className={classes.sigImage} src={dataURL} />
          </Grid>
        </Grid>
      )}
    </div>
  )
}
