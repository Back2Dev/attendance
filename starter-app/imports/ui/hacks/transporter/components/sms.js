// SMS message creator
import React from 'react'
import { AutoForm } from 'uniforms-material'
import SimpleSchema from 'simpl-schema'
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2'
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
} from '@material-ui/core'

let schema

const renderFields = (body) => {
  let fields = body.match(/([^`]+(?=`))|([^*|]+(?=\|\*))/g)?.reduce(
    (acc, curr) => {
      acc[curr] = String
      return acc
    },
    {
      from: {
        type: String,
        label: 'From (no spaces allowed)',
        defaultValue: 'SettleEasy',
      },
      to: { type: String, label: 'To (Mobile no)', defaultValue: '+61' },
    }
  )

  if (!fields) {
    fields = {
      from: {
        type: String,
        label: 'From (no spaces allowed)',
        defaultValue: 'SettleEasy',
      },
      to: { type: String, label: 'To (Mobile no)', defaultValue: '+61' },
    }
  }
  schema = new SimpleSchema2Bridge(new SimpleSchema(fields))
}

export default function SMSCard({ body, name, slug, sendSMS }) {
  const [template, setTemplate] = React.useState(body)
  const [sms, SetSMS] = React.useState(null)
  const [length, setLength] = React.useState(body.length)
  const item = {}

  renderFields(body)

  const mergePreview = (_sms) => {
    let newBody = body
    Object.keys(_sms).map((data) => {
      const newer = newBody.replace(`*|${data}|*`, _sms[data])
      return (newBody = newer)
    })
    setLength(newBody.length)
    setTemplate(newBody)
    _sms.template_name = slug
    _sms.body = newBody
    SetSMS(_sms)
  }

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item sm={12} lg={6}>
          <Card>
            <CardContent>
              Template: {name}
              <Typography variant="body1">{template}</Typography>
              <div>
                <i>
                  Remember to stay within 140 characters, you have{' '}
                  <span style={{ color: `${length > 140 ? 'red' : 'black'}` }}>
                    {length}
                  </span>
                </i>
              </div>
            </CardContent>
          </Card>
        </Grid>
        <Grid item sm={12} lg={6}>
          <Card>
            <CardContent>
              <AutoForm
                schema={schema}
                model={item}
                onSubmit={(model) => mergePreview(model)}
              />
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                color="primary"
                disabled={!sms}
                onClick={() => sendSMS(sms)}
              >
                Queue Up Email For SMS
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </div>
  )
}
