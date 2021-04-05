import React, { useState, useContext, useRef, useEffect } from 'react'
import { Meteor } from 'meteor/meteor'
import SignatureCanvas from 'react-signature-canvas'
import { Button, Paper, Typography, Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { AccountContext } from '/imports/ui/contexts/account-context.js'
import { showSuccess, showError } from '/imports/ui/utils/toast-alerts'

const useStyles = makeStyles((theme) => ({
  mobile: {
    marginTop: '10px',
  },
  card: {
    width: '280px',
    [theme.breakpoints.up('xs')]: {
      height: '100%',
      width: '200px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
  },
  gridItem: { display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
  sigImage: {
    width: '150px',
  },
  center: { display: 'flex', justifyContent: 'center' },
  sigCanvas: {
    width: '300px',
    height: '150px',
    [theme.breakpoints.up('sm')]: {
      width: '400px',
      height: '200px',
    },
  },
}))

const Sign = () => {
  const [editing, setEditing] = useState('signature')

  const { profile } = useContext(AccountContext)
  const sigRef = useRef()
  const classes = useStyles()

  const [userProfile, setUserProfile] = useState(profile)

  useEffect(() => {
    // this is not a real fix
    setTimeout(() => setUserProfile(profile), 500)
  }, [profile, userProfile])

  const clear = () => {
    sigRef.current && sigRef.current.clear()
  }

  useEffect(() => {
    setUserProfile(profile)
  }, [profile])

  const save = () => {
    const canvas = sigRef.current.getCanvas()
    canvas.toBlob((blob) => {
      const folder = 'signature'

      let fileName
      if (editing === 'signature') {
        fileName = new Date().getTime().toString() + '-signature.png'
      } else if (editing === 'initials') {
        fileName = new Date().getTime().toString() + '-initials.png'
      }

      const metaContext = {
        fileName: fileName,
        folder: folder,
        listing: Meteor.userId(),
      }

      const uploader = new Slingshot.Upload('publicUploads', metaContext)
      uploader.send(blob, function (error, downloadUrl) {
        if (error) {
          showError(err)
        } else {
          if (editing === 'signature') {
            Meteor.call('uploaded.signature', { fileName, folder }, (err) => {
              if (err) {
                showError(err)
              } else {
                showSuccess('Successfully uploaded signature')
                clear()
              }
            })
          } else if (editing === 'initials') {
            Meteor.call('uploaded.initials', { fileName, folder }, (err) => {
              if (err) {
                showError(err)
              } else {
                showSuccess('Successfully uploaded initials')
                clear()
              }
            })
          }
        }
      })
    })
  }

  return (
    <div>
      <Grid container spacing={3} alignItems="center" justify="center">
        <Grid item md={6} className={classes.gridItem}>
          <Typography variant="h6" className={classes.typeTitle}>
            Signature
          </Typography>
          {profile?.signature && (
            <img
              className={classes.sigImage}
              src={profile && Meteor.settings.public.S3_PUBLIC_URL + profile.signature}
            />
          )}
          <br />
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              clear()
              setEditing('signature')
            }}
            disabled={editing === 'signature'}
          >
            Edit signature
          </Button>
        </Grid>
        <Grid item md={6} className={classes.gridItem}>
          <Typography variant="h6" className={classes.typeTitle}>
            Initials
          </Typography>
          {profile?.initials && (
            <img
              className={classes.sigImage}
              src={profile && Meteor.settings.public.S3_PUBLIC_URL + profile.initials}
            />
          )}
          <br />
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              clear()
              setEditing('initials')
            }}
            disabled={editing === 'initials'}
          >
            Edit initials
          </Button>
        </Grid>
      </Grid>
      <br />
      <Typography variant="h6" align="center">
        Editing {editing}
      </Typography>
      <div className={classes.center}>
        <Paper className={classes.sigCanvas}>
          <SignatureCanvas
            ref={sigRef}
            penColor="blue"
            canvasProps={{ className: classes.sigCanvas, 'data-cy': 'signCanvas' }}
          />
        </Paper>
      </div>
      <br />
      <div className={classes.center}>
        <Button onClick={clear} variant="contained" color="secondary" id="clear-button">
          Clear
        </Button>
        &nbsp; &nbsp;
        <Button onClick={save} variant="contained" color="primary" id="save-button">
          Save
        </Button>
      </div>
      <br />
    </div>
  )
}

export default Sign
