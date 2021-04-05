import React, { useContext } from 'react'
import { Meteor } from 'meteor/meteor'
import ReactAvatarEditor from 'react-avatar-editor'
import { makeStyles } from '@material-ui/core/styles'
import {
  Typography,
  IconButton,
  Button,
  Slider,
  FormControlLabel,
} from '@material-ui/core/'
import RotateLeftIcon from '@material-ui/icons/RotateLeft'
import RotateRightIcon from '@material-ui/icons/RotateRight'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import { AccountContext } from '/imports/ui/contexts/account-context.js'

const Avatar = ({ save }) => {
  const allowZoomOut = false
  const borderRadius = 50
  const preview = null
  const width = 200
  const height = 200
  const { profile, loading } = useContext(AccountContext)

  const avatarRef = React.useRef(null)
  const [img, setImg] = React.useState('')
  const [scale, setScale] = React.useState(1)
  const [position, setPosition] = React.useState({ x: 0.5, y: 0.5 })
  const [rotate, setRotate] = React.useState(0)
  const [filename, setFilename] = React.useState('avatar.jpg')

  // React.useEffect(() => {
  //   if (!loading && profile) {
  //     setImg(profile.avatar)
  //   }
  // })

  const handleNewImage = (e) => {
    // this.setState({ image: e.target.files[0] })
    setImg(e.target.files[0])
    setFilename(e.target.files[0].name)
  }

  const handleScale = (e, newValue) => {
    setScale(newValue)
  }

  const handlePositionChange = (position) => {
    // this.setState({ position })
    setPosition(position)
  }

  // Send data to the Meteor server. The image is extracted as a blob
  // from the canvas, and put into an arrayBuffer. This is then converted to a
  // Uint8Array, so that it will go through the Meteor.call without being
  // stripped out (something to do with EJSON)
  const mySave = () => {
    // Will need to change this for Slingshot
    // const canvasScaled = this.editor.getImageScaledToCanvas()
    avatarRef.current.canvas.toBlob((blob) => {
      blob.arrayBuffer().then((buffer) => {
        save({
          photo: new Uint8Array(buffer),
          filename,
        })
      })
    }, 'image/jpeg')
  }

  const spin = (n) => {
    setRotate(rotate + n)
  }

  const useStyles = makeStyles((theme) => ({
    root: {
      textAlign: 'center',
    },
    input: {
      display: 'none',
    },
    button: {
      textTransform: 'none',
    },
    slider: {
      width: 30,
    },
    label: {
      marginRight: 10,
    },
  }))

  const classes = useStyles()

  return (
    <div>
      <div>
        <ReactAvatarEditor
          ref={avatarRef}
          scale={parseFloat(scale)}
          width={width}
          height={height}
          position={position}
          onPositionChange={handlePositionChange}
          rotate={parseFloat(rotate)}
          borderRadius={width / (100 / borderRadius)}
          border={1}
          image={img}
          className="editor-canvas"
        />
      </div>
      <input
        accept="image/*"
        className={classes.input}
        id="contained-button-file"
        data-cy="upload-profile-pic"
        multiple
        type="file"
        onChange={handleNewImage}
      />
      <div>
        <label htmlFor="contained-button-file">
          <Button color="primary" component="span" startIcon={<CloudUploadIcon />}>
            Upload
          </Button>
        </label>
      </div>
      <FormControlLabel
        control={
          <Slider
            onChange={handleScale}
            min={allowZoomOut ? 0.1 : 1}
            max={2}
            step={0.01}
            defaultValue={1}
            aria-labelledby="zoom-slider"
            valueLabelDisplay="auto"
            style={{ width: '100px' }}
            id="zoom-slider"
            className="slider"
          />
        }
        label={<Typography className={classes.label}>Zoom: </Typography>}
        labelPlacement="start"
      />

      <div>
        <FormControlLabel
          control={
            <>
              <IconButton
                color="primary"
                id="roatate-left"
                aria-label="rotate-left"
                component="span"
                onClick={() => spin(-90)}
              >
                <RotateLeftIcon />
              </IconButton>
              <IconButton
                color="primary"
                id="roatate-right"
                aria-label="rotate-right"
                component="span"
                onClick={() => spin(90)}
              >
                <RotateRightIcon />
              </IconButton>
            </>
          }
          label={<Typography className={classes.label}>Rotate: </Typography>}
          labelPlacement="start"
        />
      </div>
      <Button
        onClick={mySave}
        data-cy="save-profile-pic"
        variant="contained"
        color="primary"
      >
        Save
      </Button>
    </div>
  )
}

export default Avatar
