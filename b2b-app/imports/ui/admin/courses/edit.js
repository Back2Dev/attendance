import React from 'react'
import { useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'
import {Container} from '@material-ui/core'
import config from './config'
import PageEditor from './components/PageEditor'

const schemaBridge = config.edit.schema

const debug = require('debug')('app:edit')


const Edit = ({ id, item, methods }) => {
  const save = (model) => {
    try {
      methods.updatePage({id, model})
    } catch (e) {
      alert(`Update error ${e.message}`)
    }
  }

  const { goBack } = useHistory()
  const back = () => {
    goBack()
  }

  const [data, SetData] = React.useState({})

  React.useEffect(() => SetData(item), [item])

  return  <Container>
    <PageEditor data={data.pageContent} save={save}/>
  </Container>
  
  
  
  
  

}

Edit.propTypes = {
  id: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  item: PropTypes.object.isRequired,
  methods: PropTypes.object.isRequired,
}
export default Edit
