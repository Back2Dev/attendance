import React from 'react'
import PropTypes from 'prop-types'
import 'react-tabulator/lib/styles.css'
import 'react-tabulator/lib/css/materialize/tabulator_materialize.min.css'
import { ReactTabulator, reactFormatter } from 'react-tabulator'
import { TabAppbar } from '/imports/ui/utils/generic'
import PdfTemplateContext from './context'
import config from './config'
import { useHistory } from 'react-router-dom'

import { AddCircleSharpIcon, Delete } from '@material-ui/icons'
const idField = '_id'
const FILTER_NAME = 'pdf-templates:filter'
const Browse = () => {
  const tableRef = React.useRef(null)
  const { loadingPdfs, items, methods, pdfid, setPdfid, item } =
    React.useContext(PdfTemplateContext)
  const onRowClick = (_, rowComponent) => {
    const id = rowComponent._row.data[idField]
    if (!id) alert(`Could not get id from [${idField}]`)
    else methods.browse(id)
  }

  const hnadleDelete = (_, rowComponent) => {
    const id = rowComponent._row.data[idField]
    if (!id) alert(`Could not get id from [${idField}]`)
    else {
      if (id === pdfid) {
        methods.remove(id)
        push = useHistory().push
        push(`/admin/pdf-templates/`)
      } else {
        methods.remove(id)
      }
    }
  }
  push = useHistory()?.push
  const columns = config.browse.columns
  columns[1].formatter = (cell) => {
    const x = document.createElement('span')
    x.innerHTML =
      cell._cell.initialValue === pdfid ? '<span style="float: right;">✔️</span>' : ''
    x.style.width = '100%'
    return x
  }
  const onCellEdited = (cell) => {
    debug('cellEdited', cell)
    methods.update(cell._cell.row.data)
  }
  const stdCols = [
    {
      formatter: reactFormatter(<Delete />),
      width: 25,
      headerSort: false,
      hozAlign: 'center',
      cellClick: () => {
        methods.remove(pdfid)
        setPdfid(null)
      },
    },
  ]
  const tableOptions = {
    cellEdited: onCellEdited,
    //width: 100,
    // layout: 'fitData',
    pagination: 'local', //enable local pagination.
    paginationSize: 10,
    persistence: {
      sort: true,
      filter: true,
      columns: true,
    },
    persistenceID: 'pdf-templates',
    rowDblClick: onRowClick,
    rowClick: onRowClick,
  }
  if (idField === 'id') tableOptions.reactiveData = true

  const addANewRow = () => {
    methods.add()
  }

  var Contents
  if (!items.length) {
    // eslint-disable-next-line react/display-name
    Contents = () => <span>No data found</span>
  } else {
    // eslint-disable-next-line react/display-name
    Contents = () => (
      <ReactTabulator
        ref={tableRef}
        columns={columns.concat(stdCols)}
        data={items}
        options={tableOptions}
        style={{ height: '100%' }}
      />
    )
  }
  const searchChange = (e) => {
    if (!tableRef || !tableRef.current) {
      alert('I have no data for you to search yet')
      return null
    }
    tableRef.current.table.setFilter('search', 'like', e.target.value)
    localStorage.setItem(FILTER_NAME, e.target.value)
  }

  const buttons = [{ action: addANewRow, id: 'add', caption: 'Add', color: 'primary' }]
  return (
    <div>
      <TabAppbar
        title=""
        buttons={buttons}
        search={true}
        onChange={searchChange}
        defaultValue={localStorage.getItem(FILTER_NAME)}
      />
      <Contents />
    </div>
  )
}

Browse.propTypes = {
  loading: PropTypes.bool,
  items: PropTypes.array,
  methods: PropTypes.object,
  columns: PropTypes.array,
  setSelectedTemplate: PropTypes.func,
  selectedTemplate: PropTypes.string,
}
export default Browse
