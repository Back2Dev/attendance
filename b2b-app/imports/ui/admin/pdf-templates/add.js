import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import Button from '@material-ui/core/Button'
import { Box, Container, Grid, Typography } from '@material-ui/core'
import { AutoForm, AutoFields, LongTextField, SubmitField } from 'uniforms-material'
// import { CustomAutoField } from '/imports/ui/components/forms'
import config from './config'

const schemaBridge = config.edit.schema
const debug = require('debug')('app:add')

const Add = ({ item, methods }) => {
  const save = (model) => {
    try {
      methods.save(model)
    } catch (e) {
      alert(`Save error ${e.message}`)
    }
  }
  const [data, SetData] = React.useState({})
  React.useEffect(() => SetData(item), [item])

  const changed = (model) => {}

  const back = () => {
    methods.goBack()
  }

  return (
    <Container>
      <Box my={7}>
        <Typography variant="h1">pdfTemplates: {item.name}</Typography>
        <Typography color="primary" variant="h5">
          {item.type} (Revision {item.revision}: &nbsp;
          {moment(item.updatedAt).format('DD/MM/YY HH:mm')} )
        </Typography>
        <AutoForm
          schema={schemaBridge}
          model={item}
          onSubmit={save}
          // autoField={CustomAutoField}
        />
        <Button type="button" onClick={back}>
          Cancel
        </Button>
      </Box>
    </Container>
  )
}

Add.propTypes = {
  loading: PropTypes.bool.isRequired,
  item: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    revision: PropTypes.number,
    updatedAt: PropTypes.string,
    description: PropTypes.string,
    source: PropTypes.string,
    active: PropTypes.bool,
  }),
  methods: PropTypes.shape({
    save: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }),
}

Add.defaultProps = {
  item: {
    revision: 1,
    active: true,
  },
}
export default Add
