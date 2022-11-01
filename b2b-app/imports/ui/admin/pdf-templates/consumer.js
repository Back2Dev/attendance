import React from 'react'
import TemplateContext from './context'
import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import { useHistory } from 'react-router-dom'
import PdfTemplates from '/imports/api/pdf-templates/schema'
import { meteorCall } from '/imports/ui/utils/meteor'
import { obj2Search } from '/imports/api/util'
import Loader from '/imports/ui/components/commons/loading.js'
import config from './config'

const Consumer = () => {
  const { item, setItem, items, setItems, loading, setLoading, methods } =
    React.useContext(TemplateContext)
  React.useEffect(() => {
    const subHandleItems = Meteor.subscribe('all.pdfTemplates')
    // !subHandleItems.ready() ? setLoading(true) : setLoading(false)
  }, [])

  React.useEffect(() => {
    const items = PdfTemplates.find({}).map((row) => {
      row.search = obj2Search(row)
      return row
    })
    setItems(items)
  }, [])
  let history
  React.useEffect((props) => {
    history = props.history
    const id = props.match.params?.id
    setItem(PdfTemplates.findOne(id))
    const subHandleEdit = Meteor.subscribe('id.pdfTemplates', id)
    !subHandleEdit.ready() ? setLoading(true) : setLoading(false)
  })
  return (
    <div>
      {console.log('item: ' + item)}
      {console.log('history: ' + history)}
      {console.log('items: ', items)}
    </div>
  )
}

export default Consumer
