import React from 'react'
import { useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import { AutoForm } from 'uniforms-material'
import { CustomAutoField, CustomManualAndAuto } from '/imports/ui/components/forms'
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2'
import SimpleSchema from 'simpl-schema'
import { compileSchemaObject } from '../../../api/schemas/functions'
import {
  SchemaDocumentSelectorCreator,
  CreateCustomListField,
} from './components/doc-selector'

const debug = require('debug')('app:edit')

const Edit = ({ id, item, methods, schema, slug, schemaObj }) => {
  const save = (model) => {
    try {
      methods.update(id, model)
    } catch (e) {
      alert(`Update error ${e.message}`)
    }
  }

  const history = useHistory()

  const { goBack } = useHistory()
  const back = () => {
    goBack()
  }

  const [data, SetData] = React.useState({})

  React.useEffect(() => SetData(item), [item])

  return (
    <div>
      <div>
        Edit {slug} - {data.name}
      </div>
      <AutoForm
        schema={new SimpleSchema2Bridge(schema)}
        model={item}
        onSubmit={save}
        autoField={CustomManualAndAuto((props) => {
          if (!schemaObj.fields) return undefined

          const field = schemaObj.fields.filter(
            (field) => field.colName === props.name
          )[0]

          console.log(field)

          if (field && field.type === 'foreignKey')
            return SchemaDocumentSelectorCreator(field)
          else if (field && field.type === 'array') return CreateCustomListField(field)
          return undefined
        })}
      />
      <div style={{ border: '5px solid black', padding: '10px', margin: '10px' }}>
        Available in:{' '}
        {item.collections.map((collection) => (
          <a
            href={`/admin/schemas/collections/${collection}/edit/${item._id}`}
            key={collection}
            style={{ padding: '10px' }}
          >
            {collection}
          </a>
        ))}
        <AutoForm
          schema={
            new SimpleSchema2Bridge(
              compileSchemaObject({
                fields: [
                  {
                    type: 'string',
                    colName: 'schema',
                    label: 'Add to (collection):',
                  },
                ],
              })
            )
          }
          model={item}
          onSubmit={({ _id, schema }) => {
            history.push(`/admin/schemas/collections/${schema}/edit/${_id}`)
          }}
          autoField={CustomAutoField}
        />
      </div>
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
