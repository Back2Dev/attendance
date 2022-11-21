import React, { useEffect, useState } from 'react'
import { SelectField, ListField, ListItemField, AutoField } from 'uniforms-material'
import { connectField } from 'uniforms'
import { meteorCall } from '/imports/ui/utils/meteor'
import { Meteor } from 'meteor/meteor'
import { SchemasCollections } from '../../../../api/schemas/schema'
import { useTracker } from 'meteor/react-meteor-data'

function compileDisplayString(doc, displayFormat) {
  const tmpDoc = { ...doc }
  delete tmpDoc.collections
  delete tmpDoc._id
  try {
    return eval('`' + displayFormat.replaceAll('{', '${doc.') + '`')
  } catch (e) {
    return Object.values(tmpDoc).join(', ')
  }
}

function SchemaDocumentSelectorCreator(field) {
  function SchemaDocumentSelector(props) {
    const slug = field.relatedCollection

    const [schema, setSchema] = useState({})

    useEffect(async () => {
      const response = await meteorCall('all.fields.schemas', undefined, slug, false)
      setSchema(response.data)
    }, [])

    const { isLoading, data } = useTracker(() => {
      const subscription = Meteor.subscribe('all.schemas.collections', slug)
      let data = SchemasCollections.find({
        collections: {
          $in: schema.descendants || [],
        },
      }).fetch()
      return { isLoading: subscription.ready(), data }
    }, [schema])

    if (!schema.descendants || !data) return <>Loading...</>
    return (
      <SelectField
        allowedValues={data.map((doc) => doc._id)}
        transform={(_id) => {
          const doc = data.filter((doc) => doc._id === _id)[0]
          return compileDisplayString(doc, field.displayFormat)
        }}
      />
    )
  }
  return connectField(SchemaDocumentSelector)
}

function CreateCustomListField(field) {
  const ItemField = field.relatedCollection
    ? SchemaDocumentSelectorCreator(field)
    : AutoField
  console.log(field)
  function CustomListField() {
    return (
      <ListField>
        <ListItemField name="$">
          <ItemField />
        </ListItemField>
      </ListField>
    )
  }
  return connectField(CustomListField)
}

export { SchemaDocumentSelectorCreator, CreateCustomListField }
