import React from 'react'
import { useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'
import moment from 'moment'
import Button from '@material-ui/core/Button'
import { Box, Container, Grid, Typography } from '@material-ui/core'
import { AutoForm, AutoFields, LongTextField, SubmitField } from 'uniforms-material'
import { CustomAutoField } from '/imports/ui/components/forms'
import HTMLTemplate from '/imports/api/email-template'

import { schemaBridge } from './edit-schema'

const debug = require('debug')('se:add')

const Add = ({ item, methods }) => {
  const save = (model) => {
    try {
      methods.save(model)
    } catch (e) {
      alert(`Save error ${e.message}`)
    }
  }
  const [data, setData] = React.useState({})
  const [previewHTML, setPreviewHTML] = React.useState('')
  React.useEffect(() => setData(item), [item])

  const changed = (model) => {
    if (model.body !== data.body) {
      const html = model.body
        .split(/\n/)
        .map((line) => `<p>${line}</p>`)
        .join('\n')
      setPreviewHTML(
        HTMLTemplate.replace('{{contents}}', html).replace(
          '*|subject|*',
          '--- SUBJECT GOES HERE ---'
        )
      )
    }
  }

  const { goBack } = useHistory()

  const back = () => {
    goBack()
  }

  return (
    <Container>
      <Box my={7}>
        <Typography variant="h1">Message template: {item.name}</Typography>
        <Typography color="primary" variant="h5">
          {item.type} (Revision {item.revision}: &nbsp;
          {moment(item.updatedAt).format('DD/MM/YY HH:mm')} )
        </Typography>
        <AutoForm
          schema={schemaBridge}
          model={item}
          onSubmit={save}
          autoField={CustomAutoField}
          onChangeModel={(model) => changed(model)}
        >
          <AutoFields omitFields={['body']} />
          <LongTextField name="body" style={{ lineHeight: '2' }} />
          <br />
          <br />
          <Button type="button" onClick={back}>
            Cancel
          </Button>
          &nbsp;&nbsp;
          <SubmitField variant="contained" color="primary" />
        </AutoForm>
      </Box>
      {data.type === 'EMAIL' && previewHTML && (
        <Box>
          <Typography variant="h3">Email preview</Typography>
          <Typography
            dangerouslySetInnerHTML={{
              __html: previewHTML,
            }}
          />
        </Box>
      )}
    </Container>
  )
}

Add.propTypes = {
  loading: PropTypes.bool.isRequired,
  item: PropTypes.object.isRequired,
  methods: PropTypes.object.isRequired,
}
export default Add
