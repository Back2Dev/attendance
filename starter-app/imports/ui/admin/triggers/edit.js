import React from 'react'
import PropTypes from 'prop-types'
import { AutoForm } from 'uniforms-material'
import { CustomAutoField } from '/imports/ui/components/forms'

import { schemaBridge } from './edit-schema'

const debug = require('debug')('se:edit')

const Edit = ({ id, item, methods }) => {
  const save = (model) => {
    try {
      methods.update(id, model)
    } catch (e) {
      alert(`Update error ${e.message}`)
    }
  }
  const [data, SetData] = React.useState({})

  React.useEffect(() => SetData(item), [item])

  return (
    <div>
      <div>Edit Triggers - {data.name}</div>
      <AutoForm
        schema={schemaBridge}
        model={item}
        onSubmit={save}
        autoField={CustomAutoField}
      />
    </div>
  )
}

Edit.propTypes = {
  id: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  item: PropTypes.object.isRequired,
  methods: PropTypes.object.isRequired,
}
export default Edit
