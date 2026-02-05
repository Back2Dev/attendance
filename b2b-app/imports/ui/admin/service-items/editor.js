import { Meteor } from 'meteor/meteor'
import React, { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTracker } from 'meteor/react-meteor-data'
import ServiceItems from '/imports/api/service-items/schema'
import { meteorCall } from '/imports/ui/utils/meteor'
import Edit from './edit'
import config from './config'

const debug = require('debug')('app:editor')
const dateFormat = {
  inputFormat: 'DD/MM/YY hh:mm',
  outputFormat: 'DD/MM/YY h:mm A',
  invalidPlaceholder: '',
}

const Editor = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const { item, loading } = useTracker(() => {
    const subsHandle = Meteor.subscribe('id.serviceItems', id)
    return {
      loading: !subsHandle.ready(),
      item: ServiceItems.findOne(id) || {},
    }
  }, [id])

  const methods = useMemo(
    () => ({
      remove: (targetId) => meteorCall('rm.serviceItems', 'Deleting', targetId),
      update: (targetId, form) => {
        meteorCall('update.serviceItems', 'updating', form)
        navigate('/admin/service-items')
      },
    }),
    [navigate]
  )

  if (loading) return <div>Loading...</div>
  return <Edit id={id} item={item} methods={methods} loading={loading} />
}

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
//       const response = await meteorCall('fetch.id.serviceItems', null, id)
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
