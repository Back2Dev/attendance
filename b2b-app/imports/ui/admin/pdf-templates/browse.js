import React from 'react'
import PropTypes from 'prop-types'
import 'react-tabulator/lib/styles.css'
import 'react-tabulator/lib/css/materialize/tabulator_materialize.min.css'
import { ReactTabulator } from 'react-tabulator'
import { TabAppbar } from '/imports/ui/utils/generic'

const idField = '_id'
const FILTER_NAME = 'pdf-templates:filter'
const Browse = ({ items, methods, columns, setSelectedTemplate, selectedTemplate }) => {
  const tableRef = React.useRef(null)

  const onRowClick = (_, rowComponent) =>
    setSelectedTemplate(rowComponent._row.data[idField])

  columns[1].formatter = (cell) => {
    const x = document.createElement('span')
    x.innerHTML =
      cell._cell.initialValue === selectedTemplate
        ? '<span style="float: right;">✔️</span>'
        : ''
    x.style.width = '100%'
    return x
  }
  const tableOptions = {
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
        columns={columns}
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
  loading: PropTypes.bool.isRequired,
  items: PropTypes.array,
  methods: PropTypes.object.isRequired,
  columns: PropTypes.array.isRequired,
  setSelectedTemplate: PropTypes.func.isRequired,
  selectedTemplate: PropTypes.string.isRequired,
}
export default Browse
