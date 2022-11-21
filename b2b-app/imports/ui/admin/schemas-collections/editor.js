import { Meteor } from 'meteor/meteor'
import { Random } from 'meteor/random'
import { useHistory } from 'react-router-dom'
import { withTracker } from 'meteor/react-meteor-data'
import React, { useEffect, useState } from 'react'
import { SchemasCollections } from '../../../api/schemas/schema'
import { meteorCall } from '/imports/ui/utils/meteor'
import Loader from '/imports/ui/components/commons/loading.js'
import { compileSchemaObject } from '../../../api/schemas/functions'
import Edit from './edit'
import config from './config'
import SimpleSchema from 'simpl-schema'

let slug

const debug = require('debug')('app:editor')
const dateFormat = {
  inputFormat: 'DD/MM/YY hh:mm',
  outputFormat: 'DD/MM/YY h:mm A',
  invalidPlaceholder: '',
}
let history

const remove = (id) => meteorCall('rm.schemas', 'Deleting', id)
const update = (id, form) => {
  form = { ...form }
  delete form.collections
  form.collection = slug
  meteorCall('update.schemas.collections', 'updating', form)
  history.push(`/admin/schemas/collections/${slug}/list`)
}
const methods = { remove, update }

const Loading = (props) => {
  const [isLoading, setIsLoading] = useState(true)
  const [schema, setSchema] = useState(new SimpleSchema({}))
  const [schemaObj, setSchemaObj] = useState({})
  history = useHistory()
  slug = props.match.params.slug

  useEffect(() => {
    meteorCall('all.fields.schemas', undefined, slug, false).then((response) => {
      setIsLoading(false)
      setSchemaObj(response.data)
      setSchema(compileSchemaObject(response.data))
    })
  }, [props.match.params.slug])

  if (isLoading) return <Loader loading component="circular" />
  if (props.loading) return <Loader loading />
  return <Edit {...props} schema={schema} slug={slug} schemaObj={schemaObj}></Edit>
}
const Editor = withTracker((props) => {
  history = props.history
  const id = props.match.params.id
  const subsHandle = Meteor.subscribe('id.schemas.collections', id)
  const item = SchemasCollections.findOne(id) || {}
  return {
    id,
    item,
    methods,
    loading: !subsHandle.ready(),
  }
})(Loading)
export default Editor

/* 
  This section is for legacy (mysql) db. Uncomment it to use it, and comment out the "export default" above
 */
// const idField = '_id'
// const LegacyEditor = (props) => {
//   const [loading, setLoading] = React.useState(true)
//   const [item, setItem] = React.useState({})
//   const id = props.match.params.id
//   let status

//   React.useEffect(() => {
//     const fetchData = async () => {
//       const response = await meteorCall('fetch.id.schemas', null, id)
//       if (response.status === 'success') {
//         setItem(response.item)
//         setLoading(false)
//       }
//     }
//     fetchData()
//   }, [])

//   const eprops = { id, item, methods, loading }
//   debug('props', eprops)
//   if (loading) return <div>Loading...</div>
//   if (!item) return <div>Something went wrong fetching your data</div>
//   return <Edit {...eprops}></Edit>
// }

// export default idField === 'id' ? LegacyEditor : Editor
