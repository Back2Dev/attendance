import { connectField, useForm } from 'uniforms'
import React from 'react'
import { ListField, ListItemField, NestField } from 'uniforms-material'
import PropTypes from 'prop-types'

const fieldsAlwaysVisible = [
  'colName',
  'label',
  'type',
  'defaultValue',
  'optional',
  'isFieldValueLocked',
]

function SchemaFieldComponent(props) {
  const form = useForm()
  const schemaField = form.model.fields[~~props.name.split('.')[1]]
  let fields = fieldsAlwaysVisible
  if (schemaField !== undefined && schemaField.type === 'foreignKey') {
    fields = fieldsAlwaysVisible.concat(['relatedCollection', 'displayFormat'])
  }
  return <NestField fields={fields}></NestField>
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
