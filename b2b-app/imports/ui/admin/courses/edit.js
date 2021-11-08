import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Container } from '@material-ui/core'
import config from './config'
import PageEditor from './components/page-editor'

const schemaBridge = config.edit.schema

const debug = require('debug')('app:edit')

const Edit = ({ id, item, methods }) => {
  const [data, setData] = useState({})
  useEffect(() => {
    setData(item)
  }, [item])

  const save = (model) => {
    try {
      methods.updatePage({ id, model })
    } catch (e) {
      alert(`Update error ${e.message}`)
    }
  }

  return (
    <Container>
      <PageEditor pageContent={data.pageContent} save={save} data={data} />
    </Container>
  )
}

Edit.propTypes = {
  id: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  item: PropTypes.object.isRequired,
  methods: PropTypes.object.isRequired,
}
export default Edit
