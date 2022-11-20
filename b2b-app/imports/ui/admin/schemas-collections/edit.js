import React from 'react'
import { useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import { AutoForm } from 'uniforms-material'
import { CustomAutoField } from '/imports/ui/components/forms'
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2'
import SimpleSchema from 'simpl-schema'

const debug = require('debug')('app:edit')

const Edit = ({ id, item, methods, schema }) => {
  const save = (model) => {
    try {
      methods.update(id, model)
    } catch (e) {
      alert(`Update error ${e.message}`)
    }
  }

  const { goBack } = useHistory()
  const back = () => {
    goBack()
  }

  const [data, SetData] = React.useState({})

  React.useEffect(() => SetData(item), [item])

  return (
    <div>
      <div>Edit Schemas - {data.name}</div>
      <AutoForm
        schema={new SimpleSchema2Bridge(schema)}
        model={item}
        onSubmit={save}
        autoField={CustomAutoField}
      />
      <Button type="button" onClick={back}>
        Cancel
      </Button>
      &nbsp;&nbsp;
    </div>
  )
}

Edit.propTypes = {
  id: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  item: PropTypes.object.isRequired,
  methods: PropTypes.object.isRequired,
  schema: SimpleSchema,
}
export default Edit
