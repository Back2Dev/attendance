import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import React from 'react'
import { useHistory } from 'react-router-dom'
import PdfTemplates from '/imports/api/pdf-templates/schema'
import { meteorCall } from '/imports/ui/utils/meteor'
import { obj2Search } from '/imports/api/util'
import Loader from '/imports/ui/components/commons/loading.js'
import PdfTemplatesBrowse from './browse'
import config from './config'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { TextField } from '@material-ui/core'
import { Button } from '/imports/ui/utils/generic'

// const debug = require('debug')('app:lister')
// const idField = '_id'
let push
// const dateFormat = {
//   inputFormat: 'DD/MM/YY hh:mm',
//   outputFormat: 'DD/MM/YY h:mm A',
//   invalidPlaceholder: '',
// }

const remove = (id) => meteorCall('rm.pdfTemplates', 'Deleting', id)
const update = (form) => meteorCall('update.pdfTemplates', 'updating', form)
const insert = (form) => meteorCall('insert.pdfTemplates', 'adding', form)
const add = () => push('/admin/pdf-templates/add')
const edit = (id) => push(`/admin/pdf-templates/edit/${id}`)
const view = (id) => push(`/admin/pdf-templates/view/${id}`)
const archive = async (rowids) => {
  const name = prompt('Please enter a name for the archive')
  const text = confirm(
    'Are you sure you want to archive this PdfTemplates and related entities?'
  )

  if (name && text) {
    meteorCall('archive.pdfTemplates', `Archiving PdfTemplates to ${name}`, {
      name,
      ids: rowids,
    })
  }
}
const methods = { remove, update, insert, view, edit, add, archive }

// const stdCols = [
//   {
//     formatter: 'rowSelection',
//     width: 25,
//     hozAlign: 'center',
//     headerSort: false,
//     cellClick: function (e, cell) {
//       cell.getRow().toggleSelect()
//     },
//   },
//   {
//     formatter: reactFormatter(<Eye />),
//     headerSort: false,
//     width: 25,
//     hozAlign: 'center',
//     cellClick: (e, cell) => {
//       const id = cell.getData()[idField]
//       if (!id) alert(`Could not get id from [${idField}]`)
//       else methods.view(id)
//     },
//   },
//   {
//     formatter: reactFormatter(<PencilSquare />),
//     width: 25,
//     headerSort: false,
//     hozAlign: 'center',
//     cellClick: (e, cell) => {
//       const id = cell.getData()[idField]
//       if (!id) alert(`Could not get id from [${idField}]`)
//       else methods.edit(id)
//     },
//   },
// ]

const PdfTemplatesWrapper = (props) => {
  push = useHistory()?.push
  // eslint-disable-next-line react/prop-types
  if (props.loading) return <Loader loading />
  return <PdfTemplatesBrowse {...props}></PdfTemplatesBrowse>
}

const PdfTemplatesNameLister = withTracker(
  ({ setSelectedTemplate, selectedTemplate }) => {
    const subsHandle = Meteor.subscribe('all.names.pdfTemplates')
    const items = PdfTemplates.find({}, { fields: { name: 1 } }).map((row) => {
      row.search = obj2Search(row)
      return row
    })
    const columns = config.browse.columns
    return {
      items,
      methods,
      columns,
      loading: !subsHandle.ready(),
      setSelectedTemplate,
      selectedTemplate,
    }
  }
)(PdfTemplatesWrapper)

const PdfTemplatesBrowser = () => {
  const [, setSample] = React.useState('')
  const [selectedTemplate, setSelectedTemplate] = React.useState('')

  const addANewRow = () => {
    methods.add()
  }
  const btn = { action: addANewRow, id: 'add', caption: 'Save', color: 'primary' }
  return (
    <div>
      <div
        style={{ width: '30%', display: 'inline-block', marginTop: '0%', float: 'left' }}
      >
        <PdfTemplatesNameLister
          setSelectedTemplate={setSelectedTemplate}
          selectedTemplate={selectedTemplate}
        />
      </div>
      <div
        style={{
          width: '70%',
          display: 'inline-block',
          padding: '10px',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '600px',
            border: 'solid red 10px',
          }}
        ></div>
        <div style={{ padding: '10px' }}>
          <div style={{ float: 'left' }}>
            <Autocomplete
              id="message-search"
              style={{ width: 300 }}
              options={['Sample 1', 'Sample 2', 'Sample 3'].map((t) => t)}
              onChange={(event, newValue) => {
                setSample(newValue)
              }}
              renderInput={(params) => (
                <TextField {...params} label="Sample" variant="outlined" />
              )}
            />
          </div>
          <div style={{ float: 'right' }}>
            <Button
              id={btn.id}
              key={btn.id}
              onClick={btn.action}
              color={btn.color}
              variant="contained"
            >
              {btn.caption}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PdfTemplatesBrowser
