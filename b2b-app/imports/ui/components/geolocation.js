import React, { useState } from 'react'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import { HiddenField } from 'uniforms-material'

import { makeStyles } from '@material-ui/core/styles'
import { useEffect } from 'react'

const useStyles = makeStyles((theme) => ({
  root: { borderTop: '1px solid #eee', marginBottom: '10px' },
  mobile: {
    marginTop: '10px',
  },
  header: {},
}))

const Geolocation = ({ title, subheader, id, header }) => {
  const [lat, setLat] = useState(null)
  const [lng, setLng] = useState(null)
  const [status, setStatus] = useState(null)
  const classes = useStyles()

  const getLocation = () => {
    if (!navigator.geolocation) {
      setStatus('Geolocation is not supported by your browser')
    } else {
      navigator.permissions
        .query({ name: 'geolocation' })
        .then(function (permissionStatus) {
          console.log('geolocation permission status is ', permissionStatus.state)
          if (permissionStatus.state === 'prompt') {
            alert(
              'We need to know your location. In order to get this, we need you to allow permission to access your location. A pop-up will appear for this. Please click the ALLOW button'
            )
          }
          setStatus('Locating...')

          navigator.geolocation.getCurrentPosition(
            (position) => {
              setStatus(null)
              setLat(position.coords.latitude)
              setLng(position.coords.longitude)
            },
            () => {
              setStatus('Unable to retrieve your location')
            }
          )
        })
    }
  }

  useEffect(() => getLocation(), [])

  return (
    <div className="Geo">
      <Card className={classes.root}>
        <CardHeader
          className={classes.header}
          titleTypographyProps={{ variant: 'body1' }}
          title={title}
          subheader={
            <Fragment>
              {' '}
              <p>{header}</p> <p>{subheader}</p>
            </Fragment>
          }
          action={<button onClick={getLocation}>Get Location</button>}
        />
        <CardContent>
          {status && <p>{status}</p>}
          {!status && (
            <p>
              Latitude: {lat}, Longitude: {lng}
            </p>
          )}
          <HiddenField name={id} value={lat + ',' + lng} />;
        </CardContent>
      </Card>
    </div>
  )
}

export default Geolocation
