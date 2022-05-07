import React from 'react'
import { useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Button, Box, Container, Typography } from '@material-ui/core'
import { AutoForm } from 'uniforms-material'
import { CustomAutoField } from '/imports/ui/components/forms'
import config from './config'

const schemaBridge = config.edit.schema

const debug = require('debug')('app:edit')

const Edit = ({ id, item, methods }) => {
  const save = (model) => {
    try {
      methods.update(id, model)
    } catch (e) {
      debug(`Update error ${e.message}`)
    }
  }

  const { goBack } = useHistory()
  const back = () => {
    goBack()
  }

  const [data, SetData] = React.useState({})

  React.useEffect(() => SetData(item), [item])

  return (
    <Container>
      <Box my={7}>
        <Typography variant="h1">Forms: {item.name}</Typography>
        <Typography color="primary" variant="h5">
          {item.type} (Revision {item.revision}: &nbsp;
          {moment(item.updatedAt).format('DD/MM/YY HH:mm')} )
        </Typography>
        <AutoForm
          schema={schemaBridge}
          model={item}
          onSubmit={save}
          autoField={CustomAutoField}
        />
        <Button type="button" onClick={back}>
          Cancel
        </Button>
        &nbsp;&nbsp;
      </Box>
    </Container>
  )
}

Edit.propTypes = {
  id: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  item: PropTypes.object.isRequired,
  methods: PropTypes.object.isRequired,
}
export default Edit
