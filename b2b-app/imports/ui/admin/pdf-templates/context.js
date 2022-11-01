// import React from 'react'
// import { Meteor } from 'meteor/meteor'
// import { useTracker } from 'meteor/react-meteor-data'
import { useHistory } from 'react-router-dom'
import PdfTemplates from '/imports/api/pdf-templates/schema'
import { meteorCall } from '/imports/ui/utils/meteor'
import { obj2Search } from '/imports/api/util'
import Loader from '/imports/ui/components/commons/loading.js'
import config from './config'

import { Meteor } from 'meteor/meteor'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { useTracker } from 'meteor/react-meteor-data'

export const PdfTemplateContext = React.createContext('pdf-template')

export const PdfTemplateProvider = (props) => {
  const { children } = props

  const mounted = useRef(true)
  useEffect(() => () => (mounted.current = false), [])
  const [loading, setLoading] = useState(false)
  // const [start, setStart] = useState(false)

  // useEffect(() => {
  //   setStart(true)
  // }, [])

  const remove = (id) => meteorCall('rm.pdfTemplates', 'Deleting', id)

  const save = (form) => {
    meteorCall('insert.pdfTemplates', 'saving', form)
    push('/admin/pdf-templates')
  }

  const update = (id, form) => {
    meteorCall('update.pdfTemplates', 'updating', form)
    history.push('/admin/pdf-templates')
  }

  const goBack = useHistory().goBack

  const insert = (form) => meteorCall('insert.pdfTemplates', 'adding', form)

  const add = () => push(`/admin/pdf-templates/add`)
  const edit = (id) => push(`/admin/pdf-templates/edit/${id}`)
  const view = (id) => push(`/admin/pdf-templates/view/${id}`)
  const archive = async (rowids) => {
    const name = prompt('Please enter a name for the archive')
    const text = confirm(
      `Are you sure you want to archive this PdfTemplates and related entities?`
    )

    if (name && text) {
      meteorCall('archive.pdfTemplates', `Archiving PdfTemplates to ${name}`, {
        name,
        ids: rowids,
      })
    }
  }

  const methods = [remove, save, update, insert, view, edit, add, archive, goBack]

  const { loadingPdfs, items = [] } = useTracker(() => {
    const sub = Meteor.subscribe('all.pdfTemplates')
    return {
      loadingPdfs: !sub.ready(),
      items: PdfTemplates.find({}).fetch(),
      // items: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'],
    }
  })

  let history
  // const { loadingPdf, item } = useTracker(() => {
  //   history = props.history
  //   const id = props.match.params.id
  //   const subHandleEdit = Meteor.subscribe('id.pdfTemplates', id)

  //   return {
  //     loadingPdf: !subHandleEdit.ready(),
  //     item: PdfTemplates.findOne({ _id: id }) || {},
  //   }
  // }, [id])

  const columns = config.list.columns

  // const pdfTemplates = {
  //   loading,
  //   loadingPdfs,
  //   items,
  //   // loadingPdf,
  //   // item,
  //   methods,
  //   columns,
  // }

  return (
    <PdfTemplateContext.Provider
      value={{
        loading,
        loadingPdfs,
        items,
        // loadingPdf,
        // item,
        methods,
        columns,
      }}
    >
      {children}
    </PdfTemplateContext.Provider>
  )
}

PdfTemplateProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export const PdfTemplateConsumer = PdfTemplateContext.Consumer

// let push

// const remove = (id) => meteorCall('rm.pdfTemplates', 'Deleting', id)
// const save = (form) => {
//   meteorCall('insert.pdfTemplates', 'saving', form)
//   push('/admin/pdf-templates')
// }
// const update = (id, form) => {
//   meteorCall('update.pdfTemplates', 'updating', form)
//   history.push('/admin/pdf-templates')
// }
// // const goBack = useHistory().goBack
// const insert = (form) => meteorCall('insert.pdfTemplates', 'adding', form)
// const add = () => push(`/admin/pdf-templates/add`)
// const edit = (id) => push(`/admin/pdf-templates/edit/${id}`)
// const view = (id) => push(`/admin/pdf-templates/view/${id}`)
// const archive = async (rowids) => {
//   const name = prompt('Please enter a name for the archive')
//   const text = confirm(
//     `Are you sure you want to archive this PdfTemplates and related entities?`
//   )

//   if (name && text) {
//     meteorCall('archive.pdfTemplates', `Archiving PdfTemplates to ${name}`, {
//       name,
//       ids: rowids,
//     })
//   }
// }

// const methods = { remove, save, update, insert, view, edit, add, archive }

// // export const Tracker = withTracker((props) => {
// //   const subHandleItems = Meteor.subscribe('all.pdfTemplates')
// //   const items = PdfTemplates.find({}).map((row) => {
// //     row.search = obj2Search(row)
// //     return row
// //   })
// //   history = props.history
// //   const id = props.match.params?.id
// //   const item = PdfTemplates.findOne(id) || {}
// //   const subHandleEdit = Meteor.subscribe('id.pdfTemplates', id)
// //   const columns = config.list.columns
// //   return {
// //     state: {
// //       item,
// //       items,
// //       methods,
// //       columns,
// //       loadingItems: !subHandleItems.ready(),
// //       loadingItem: !subHandleEdit.ready(),
// //     },
// //   }
// // })

// const items = [
//   {
//     _id: 'item1',
//     name: 'item1',
//     revision: 1,
//     description: 'item1',
//     source: 'source1',
//     active: true,
//   },
//   {
//     _id: 'item2',
//     name: 'item2',
//     revision: 1,
//     description: 'item2',
//     source: 'source2',
//     active: false,
//   },
//   {
//     _id: 'item3',
//     name: 'item3',
//     revision: 1,
//     description: 'item3',
//     source: 'source3',
//     active: true,
//   },
//   {
//     _id: 'item4',
//     name: 'item4',
//     revision: 1,
//     description: 'item4',
//     source: 'source4',
//     active: false,
//   },
//   {
//     _id: 'item5',
//     name: 'item5',
//     revision: 1,
//     description: 'item5',
//     source: 'source5',
//     active: true,
//   },
// ]
// function templateReducer(state, action) {
//   const { type, payload } = action
//   switch (type) {
//     case 'setItem':
//       return {
//         ...state,
//         item: payload,
//       }
//     case 'setItems':
//       return {
//         ...state,
//         items: payload,
//       }
//     case 'setLoading':
//       return {
//         ...state,
//         loading: payload,
//       }
//     default:
//       return state
//   }
// }

// export const TemplateProvider = ({ children, source }) => {
//   const [state, dispatch] = React.useReducer(templateReducer, {
//     item: PdfTemplates.findOne(props.match.params?.id),
//     items: [
//       {
//         _id: 'item1',
//         name: 'item1',
//         revision: 1,
//         description: 'item1',
//         source: 'source1',
//         active: true,
//       },
//       {
//         _id: 'item2',
//         name: 'item2',
//         revision: 1,
//         description: 'item2',
//         source: 'source2',
//         active: false,
//       },
//     ],
//     methods: methods,
//     loading: true,
//   })
//   const setItems = (data) => {
//     dispatch({ type: 'setItems', payload: data })
//   }
//   const setItem = (data) => {
//     dispatch({ type: 'setItem', payload: data })
//   }
//   const setLoading = (data) => {
//     dispatch({ type: 'setLoading', payload: data })
//   }
//   return (
//     <TemplateContext.Provider value={{ ...state, setItem, setItems, setLoading }}>
//       {children}
//     </TemplateContext.Provider>
//   )
// }

// // export const TemplateProvider = Tracker(Provider)
// // export const TemplateConsumer = TemplateContext.Consumer

// // const PdfTemplatesWrapper = (props) => {
// //   push = useHistory()?.push
// //   if (props.loading) return <Loader loading />
// //   if (props.mode === 'view') {
// //     return <View {...props}></View>
// //   } else if (mode === 'list') {
// //     return <PdfTemplatesList {...props}></PdfTemplatesList>
// //   } else if (mode === 'edit') {
// //     return <Edit {...props}></Edit>
// //   } else if (mode === 'add') {
// //     return <Add {...props}></Add>
// //   }
// // }
