import { connectField, useForm } from 'uniforms'
import React, { useContext } from 'react'
import {
  AutoField,
  ListField,
  ListItemField,
  NestField,
  SelectField,
} from 'uniforms-material'
import PropTypes from 'prop-types'
import SchemasContext from '../context'

const fieldsAlwaysVisible = [
  'colName',
  'label',
  'type',
  'defaultValue',
  'optional',
  'isFieldValueLocked',
]

function SchemaSelector(prop) {
  const context = useContext(SchemasContext)
  const { data, isLoading } = context.getData()
  return (
    <>
      {!isLoading && (
        <SelectField
          allowedValues={data.map((schema) => schema.slug)}
          transform={(value) => {
            const schema = data.filter((schema) => schema.slug === value)[0]
            return `${schema.name} (${schema.slug})`
          }}
        />
      )}
    </>
  )
}

const ConnectedSchemaSelector = connectField(SchemaSelector)
export { ConnectedSchemaSelector }

function SchemaFieldComponent(props) {
  const form = useForm()
  const schemaField = form.model.fields[~~props.name.split('.')[1]]
  let fields = fieldsAlwaysVisible
  const isFK = schemaField !== undefined && schemaField.type === 'foreignKey'
  if (isFK) {
    fields = fieldsAlwaysVisible.concat(['displayFormat'])
  }
  return (
    <NestField fields={fields}>
      {fields.map((fieldName) => (
        <AutoField key={fieldName} name={fieldName} />
      ))}
      {isFK && <ConnectedSchemaSelector name="relatedCollection" />}
    </NestField>
  )
}
SchemaFieldComponent.propTypes = {
  name: PropTypes.string,
}

const ConnectedSchemaFieldComponent = connectField(SchemaFieldComponent)

function SchemaFieldsEditor() {
  return (
    <ListField name="">
      <ListItemField name="$">
        <ConnectedSchemaFieldComponent name="" />
      </ListItemField>
    </ListField>
  )
}
const ConnectedSchemaFieldsEditor = connectField(SchemaFieldsEditor)
export default ConnectedSchemaFieldsEditor
