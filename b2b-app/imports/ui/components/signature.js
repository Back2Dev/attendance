import React from 'react'
import SignatureCanvas from 'react-signature-canvas'
import { Button, Paper, Typography, Grid } from '@material-ui/core'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'

import { makeStyles } from '@material-ui/core/styles'
import './signature.css'

const useStyles = makeStyles((theme) => ({
  root: { borderTop: '1px solid #eee', marginBottom: '10px' },
  mobile: {
    marginTop: '10px',
  },
  header: {},
  sigImage: {
    backgroundSize: '220px 60px',
    width: '200px',
    height: '50px',
    backgroundColor: 'white',
    border: '1px solid #ccc',
  },
  sigCanvas: { style: { width: '100%', height: '200px' } },
  clearBtn: {
    color: 'red',
    border: '0px solid #ccc',
  },
}))

export default Sign = ({ title, subheader, showPreview = false }) => {
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
  const updateURL = () => {}

  return (
    <div>
      <Card className={classes.root}>
        <CardHeader
          className={classes.header}
          titleTypographyProps={{ variant: 'body1' }}
          title={title}
          subheader={subheader}
          action={
            <Button onClick={clear} className={classes.clearBtn} type="button">
              X
            </Button>
          }
        />
        <CardContent style={{ height: '220px' }}>
          <SignatureCanvas
            ref={sigRef}
            penColor="green"
            canvasProps={{ class: 'sigCanvas' }}
            onEnd={trim}
          />
        </CardContent>
        {dataURL && showPreview && (
          <CardContent>
            <Typography variant="h6">Preview:</Typography>
            <img className={classes.sigImage} src={dataURL} />
          </CardContent>
        )}
      </Card>
    </div>
  )
}
