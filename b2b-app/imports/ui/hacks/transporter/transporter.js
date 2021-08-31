import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Autocomplete from '@material-ui/lab/Autocomplete'
import {
  Container,
  Collapse,
  TextField,
  Typography,
  CardMedia,
  CardContent,
  CardActions,
  CardActionArea,
  Card,
} from '@material-ui/core'
import EmailCard from './components/email'
import SMSCard from './components/sms'

const debug = require('debug')('app:transporter')

const useStyles = makeStyles({
  root: {
    maxWidth: '100%',
  },
  media: {
    height: 270,
  },
})

const TransporterPage = ({ sendEmail, sendSMS, messages }) => {
  const [template, setTemplate] = React.useState('')
  const [filter, setFilter] = React.useState('')
  const classes = useStyles()

  const select = (t) => {
    setTemplate(t)
  }

  React.useEffect(() => {}, [messages])

  const RenderCard = () => {
    switch (filter) {
      case 'EMAIL':
        return <EmailCard {...template} sendEmail={sendEmail} />
      case 'SMS':
        return <SMSCard {...template} sendSMS={sendSMS} />
      default:
        return null
    }
  }

  return (
    <Container>
      <Collapse in={!template}>
        <Card className={classes.root}>
          <CardActionArea>
            <CardMedia
              className={classes.media}
              image="/images/email.jpg"
              title="Email"
            />
            <CardContent>
              <Typography gutterBottom variant="h2" component="h2">
                Messages Transporter
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                You can use this page to line up a message to be sent, First select the
                message type and then by name, and then fill in all of the fields and
                click "Submit" to line up the message in the transporter
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Collapse>
      <Card>
        <CardActions>
          <Autocomplete
            id="message-search"
            style={{ paddingTop: '8px' }}
            options={['SMS', 'EMAIL', 'APP'].map((t) => t)}
            style={{ width: 300 }}
            onChange={(event, newValue) => {
              setFilter(newValue)
            }}
            renderInput={(params) => (
              <TextField {...params} label="Type" variant="outlined" />
            )}
          />
          <Autocomplete
            id="message-search"
            style={{ paddingTop: '8px' }}
            options={
              filter
                ? messages
                    .filter((m) => m.type === filter)
                    .sort()
                    .map((t) => t)
                : messages.sort().map((t) => t)
            }
            style={{ width: 300 }}
            getOptionLabel={(option) => option.name}
            onChange={(event, newValue) => {
              console.log(newValue)
              select(newValue)
            }}
            renderInput={(params) => (
              <TextField {...params} label="Templates" variant="outlined" />
            )}
          />
        </CardActions>
      </Card>

      <Collapse in={!!template}>{template ? <RenderCard /> : null}</Collapse>
    </Container>
  )
}

export default TransporterPage
