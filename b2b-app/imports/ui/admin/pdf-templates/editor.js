import { Meteor } from 'meteor/meteor'
import { Random } from 'meteor/random'
import { withTracker } from 'meteor/react-meteor-data'
import React from 'react'
import PdfTemplates from '/imports/api/pdf-templates/schema'
import { meteorCall } from '/imports/ui/utils/meteor'
import Loader from '/imports/ui/components/commons/loading.js'
import Edit from './edit'
import config from './config'

const debug = require('debug')('app:editor')
const dateFormat = {
  inputFormat: 'DD/MM/YY hh:mm',
  outputFormat: 'DD/MM/YY h:mm A',
  invalidPlaceholder: '',
}
let history

const remove = (id) => meteorCall('rm.pdfTemplates', 'Deleting', id)
const update = (id, form) => {
  meteorCall('update.pdfTemplates', 'updating', form)
  history.push('/admin/pdf-templates')
}
const methods = { remove, update }

const Loading = (props) => {
  if (props.loading) return <Loader loading />
  return <Edit {...props}></Edit>
}
const Editor = withTracker((props) => {
  history = props.history
  const id = props.match.params.id
  const subsHandle = Meteor.subscribe('id.pdfTemplates', id)
  const item = PdfTemplates.findOne(id) || {}
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
//       const response = await meteorCall('fetch.id.pdfTemplates', null, id)
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
