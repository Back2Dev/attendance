import React from 'react'
import SignatureCanvas from 'react-signature-canvas'
import { Button, Box } from '@mui/material'
// import Card from '@mui/material/Card'
// import CardHeader from '@mui/material/CardHeader'
// import CardMedia from '@mui/material/CardMedia'
// import CardContent from '@mui/material/CardContent'
// import CardActions from '@mui/material/CardActions'
import { connectField } from 'uniforms'

// import { makeStyles } from '@mui/material/styles'
import './signature.css'

// const useStyles = makeStyles(() => ({
//   root: { marginBottom: '5px', border: '0px' },
//   sigImage: {
//     backgroundSize: '220px 60px',
//     width: '200px',
//     height: '50px',
//     backgroundColor: 'white',
//     border: '1px solid #ccc',
//   },
//   sigCanvas: { style: { width: '100%', height: '200px' } },
//   // clearBtn: {
//   //   color: 'red',
//   //   border: '0px solid #ccc',
//   // },
// }))

const Sign = ({ showPreview = false, onChange }) => {
  // const [dataURL, setDataURL] = React.useState(null)
  const sigRef = React.useRef()
  // const classes = useStyles()

  const trim = () => {
    console.log('toData', sigRef.current.toData())
    // if (sigRef.current) {
    //   setDataURL(sigRef.current.getTrimmedCanvas().toDataURL('image/jpg'))
    // }
    if (sigRef.current) {
      onChange(sigRef.current?.toDataURL())
    }
  }

  const clear = () => {
    sigRef.current && sigRef.current.clear()
  }
  // const updateURL = () => {}

  return (
    // <Card className={classes.root}>
    //   <CardHeader
    //       className={classes.header}
    //       titleTypographyProps={{ variant: 'body1' }}
    //       title={title}
    //       subheader={
    //         <Fragment>
    //           <p>{header}</p> <p>{subheader}</p>{' '}
    //         </Fragment>
    //       }
    //       action={
    //         <Button onClick={clear} className={classes.clearBtn} type="button">
    //           X
    //         </Button>
    //       }
    //     />
    //   <CardContent style={{ height: '220px' }}>
    //     <SignatureCanvas
    //       ref={sigRef}
    //       penColor="green"
    //       canvasProps={{ class: 'sigCanvas' }}
    //       onEnd={trim}
    //     />
    //   </CardContent>
    //   {dataURL && showPreview && (
    //     <CardContent>
    //       <Typography variant="h6">Preview:</Typography>
    //       <img className={classes.sigImage} src={dataURL} />
    //     </CardContent>
    //   )}
    //   <Button onClick={clear} variant="text" color="error">
    //     Clear
    //   </Button>
    // </Card>
    <Box marginTop="5px">
      <SignatureCanvas
        ref={sigRef}
        penColor="green"
        canvasProps={{ className: 'sigCanvas' }}
        onEnd={trim}
      />
      <Button variant="outlined" onClick={clear}>
        Clear
      </Button>
    </Box>
  );
}

export default connectField(Sign)
