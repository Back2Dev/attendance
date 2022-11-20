import React, { useState, useEffect } from 'react'
import { withTracker } from 'meteor/react-meteor-data'
import { useHistory } from 'react-router-dom'
import { meteorCall } from '/imports/ui/utils/meteor'
import Loader from '/imports/ui/components/commons/loading.js'
import Add from './add'
import config from './config'
import { compileSchemaObject } from '../../../api/schemas/functions'
import SimpleSchema from 'simpl-schema'
import { method } from 'lodash'

const debug = require('debug')('app:adder')
let push
let slug

const methods = {
  save: (form) => {
    form.collection = slug
    meteorCall('insert.schemas.collections', 'saving', form)
    push(`/admin/schemas/collections/${slug}/list/`)
  },
}

const Loading = (props) => {
  const [isLoading, setIsLoading] = useState(true)
  const [schema, setSchema] = useState(new SimpleSchema({}))
  const [schemaObj, setSchemaObj] = useState({})

  useEffect(() => {
    meteorCall('all.fields.schemas', undefined, props.match.params.slug, false).then(
      (response) => {
        console.log(response)
        setIsLoading(false)
        setSchemaObj(response.data)
        setSchema(compileSchemaObject(response.data))
      }
    )
  }, [])

  if (isLoading) return <Loader loading component="circular" />
  push = useHistory()?.push
  slug = props.match.params.slug
  if (props.loading) return <Loader loading />
  return (
    <Add
      {...props}
      insert={methods.save}
      schema={schema}
      slug={props.match.params.slug}
      schemaObj={schemaObj}
    ></Add>
  )
}

const Adder = withTracker((props) => {
  const defaultObject = {}
  return {
    item: defaultObject,
    methods,
    loading: false,
  }
})(Loading)

export default Adder
