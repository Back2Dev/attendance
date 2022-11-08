import React from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import { AutoForm } from 'uniforms-material'
// import { CustomAutoField } from '/imports/ui/components/forms'
import config from './config'

// const PdfTemplateContext = React.lazy(() => {
//   import('./context')
// })
import PdfTemplateContext from './context'

const schemaBridge = config.edit.schema
const debug = require('debug')('app:edit')

const Edit = ({ sbitem, sbmethods }) => {
  let item
  let methods

  if (sbmethods && sbitem) {
    methods = sbmethods
    item = sbitem
  } else {
    const context = React.useContext(PdfTemplateContext)
    methods = context.methods
    item = context.item
  }

  // const { item, methods } = React.useContext(PdfTemplateContext)

  const save = (model) => {
    try {
      methods.update(model)
    } catch (e) {
      console.log('error: ', e)
      alert(`Update error ${e.message}`)
    }
  }

  const back = () => {
    methods.goBack()
  }

  const [data, SetData] = React.useState({})

  React.useEffect(() => SetData(item), [item])

  return (
    <div>
      <div>Edit PdfTemplates - {data.name}</div>
      <AutoForm
        schema={schemaBridge}
        model={item}
        onSubmit={save}
        // autoField={CustomAutoField}
      />
      <Button type="button" onClick={back}>
        Cancel
      </Button>
      &nbsp;&nbsp;
    </div>
  )
}

Edit.propTypes = {
  // loading: PropTypes.bool.isRequired,
  // id: PropTypes.string.isRequired,
  item: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string.isRequired,
    revision: PropTypes.number.isRequired,
    updatedAt: PropTypes.any,
    description: PropTypes.string,
    source: PropTypes.string,
    active: PropTypes.bool.isRequired,
  }),
  methods: PropTypes.shape({
    update: PropTypes.func.isRequired,
    goBack: PropTypes.func,
  }),
}

export default Edit
