// data layer
import { Meteor } from 'meteor/meteor'
import { useTracker } from 'meteor/react-meteor-data'
import { meteorCall } from '/imports/ui/utils/meteor'
import React, { useContext, useState, useEffect } from 'react'
import Loader from '/imports/ui/components/commons/loading.js'
import List from './list'
import SchemasCollectionsContext from './context'
import { SchemasCollections } from '../../../api/schemas/schema'

const Lister = (props) => {
  const context = useContext(SchemasCollectionsContext)
  const [schema, setSchema] = useState({})
  const [reloader, reloadData] = useState(true)

  const slug = props.match.params.slug

  useEffect(async () => {
    const response = await meteorCall('all.fields.schemas', undefined, slug, false)
    setSchema(response.data)
  }, [])

  const { isLoading, data } = useTracker(() => {
    console.log(schema)
    const subscription = Meteor.subscribe('all.schemas.collections', slug)
    let data = SchemasCollections.find({
      collections: {
        $in: schema.descendants || [],
      },
    }).fetch()
    return { isLoading: subscription.ready(), data }
  }, [schema])

  console.log(!schema.descendants, isLoading, data)
  if (!schema.descendants || !data) return <Loader loading component="circular" />

  console.log(data)
  data.map((d) => {
    const extracted = { ...d }
    delete extracted._id
    delete extracted.collections
    d.search = Object.values(extracted).join(' ')
    return d
  })

  const editProps = {
    data: data,
    methods: context.methods,
    schema: schema,
    slug,
    reloader,
    reloadData,
  }
  // return <></>
  return <List {...editProps} />
}

export default Lister
