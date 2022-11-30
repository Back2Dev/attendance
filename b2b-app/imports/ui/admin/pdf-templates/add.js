import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import Button from '@material-ui/core/Button'
import { Box, Container, Grid, Typography } from '@material-ui/core'
import { AutoForm } from 'uniforms-material'
// import { CustomAutoField } from '/imports/ui/components/forms'
import config from './config'
import PdfTemplateContext from './context'

const schemaBridge = config.add.schema
const debug = require('debug')('app:add')

const Add = ({
  titlecolor,
  alignment,
  cancelButtoncolor,
  headingsize,
  titlesize,
  subtitleColor,
}) => {
  const item = config?.add?.defaultObject || {}

  const { methods } = React.useContext(PdfTemplateContext)
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
      <Box my={7} sx={{ color: titlecolor, textAlign: alignment }}>
        <Typography variant={titlesize}>pdfTemplates: {item.name}</Typography>
        <Typography variant={headingsize} color={subtitleColor}>
          {item.type} (Revision {item.revision}: &nbsp;
          {moment(item.updatedAt).format('DD/MM/YY HH:mm')} )
        </Typography>
        <AutoForm
          schema={schemaBridge}
          model={item}
          onSubmit={save}
          // autoField={CustomAutoField}
        />
        <Button type="button" onClick={back} style={{ color: cancelButtoncolor }}>
          Cancel
        </Button>
      </Box>
    </Container>
  )
}

Add.propTypes = {
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
  cancelButtoncolor: PropTypes.string,
  titlesize: PropTypes.string,
  headingsize: PropTypes.string,
  titlecolor: PropTypes.string,
  alignment: PropTypes.string,
}

Add.defaultProps = {
  item: {
    revision: 1,
    active: true,
  },
  titlecolor: 'purple',
  alignment: 'left',
  cancelButtoncolor: 'red',
  headingsize: 'h1',
  titlesize: 'h4',
}
export default Add
