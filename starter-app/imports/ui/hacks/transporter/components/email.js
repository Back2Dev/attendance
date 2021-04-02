// Email message creator
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
import HTMLTemplate from '/imports/api/email-template'

let schema = new SimpleSchema2Bridge(new SimpleSchema({ email: String }))

const renderFields = (template) => {
  let fields = template.match(/([^`]+(?=`))|([^*|]+(?=\|\*))/g).reduce(
    (acc, curr) => {
      acc[curr] = String
      return acc
    },
    { recipient: String }
  )

  schema = new SimpleSchema2Bridge(new SimpleSchema(fields))
}

export default function EmailCard({ name, body: template, slug, sendEmail }) {
  const myTemplate = template
    .split(/\n/)
    .map((line) => `<p>${line}</p>`)
    .join('')
  let defBody = HTMLTemplate.replace('*|contents|*', myTemplate).replace(
    '*|subject|*',
    '--- SUBJECT GOES HERE ---'
  )

  const [emailBody, setEmailBody] = React.useState(defBody)
  const [email, setEmail] = React.useState(null)
  const item = {}
  renderFields(template)

  const sendMessage = () => {
    sendEmail(email)
  }

  const mergePreview = (_email) => {
    let contents = myTemplate
    Object.keys(_email).map((data) => {
      const newer = contents.replace(`*|${data}|*`, _email[data])
      return (contents = newer)
    })
    const body = HTMLTemplate.replace('*|contents|*', contents).replace(
      '*|subject|*',
      '--- SUBJECT GOES HERE ---'
    )
    setEmailBody(body)
    _email.template_name = slug
    _email.body = body
    setEmail(_email)
  }

  return (
    <div>
      <Grid container spacing={2} style={{ marginTop: '10px' }}>
        <Grid item sm={12} lg={6}>
          <Card>
            <CardContent>
              Template: {name}
              <Typography
                dangerouslySetInnerHTML={{
                  __html: emailBody,
                }}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item sm={12} lg={6}>
          <Card>
            <CardContent>
              <Typography>Subject: {slug}</Typography>
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
                disabled={!email}
                onClick={() => sendMessage()}
              >
                Send email
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </div>
  )
}
