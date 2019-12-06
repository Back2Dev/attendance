import React from 'react'
import PropTypes from 'prop-types'
import { Button, Segment, Modal, Form } from 'semantic-ui-react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import 'react-tabulator/lib/styles.css'
import 'react-tabulator/lib/css/tabulator.min.css'
import { ReactTabulator } from 'react-tabulator'

const debug = require('debug')('manx:add')

const List = ({ items, update, remove, add, columns, loading }) => {
  const [rows, setRows] = React.useState(items)
  const [rowsSelected, setRowsSelected] = React.useState([])
  const [sessionDate, setSessionDate] = React.useState(new Date())
  const [modalOpen, setModalOpen] = React.useState(false)

  React.useEffect(() => {
    setRows(items)
    setRowsSelected([])
  }, [items])

  const onCellEdited = cell => {
    debug('cellEdited', cell)
    update(cell._cell.row.data)
  }

  const tableOptions = {
    cellEdited: onCellEdited,
    width: 100,
    rowSelected: function(row) {
      rowsSelected.push(row._row.data._id)
      setRowsSelected(rowsSelected)
    },
    rowDeselected: function(row) {
      for (i = 0; i < rowsSelected.length; i++) {
        if (rowsSelected[i] === row._row.data._id) {
          rowsSelected.splice(i, 1)
          setRowsSelected(rowsSelected)
        }
      }
    }
  }

  const inputChange = e => {
    rows[e.target.name] = e.target.value
    setRows(rows)
  }

  const addANewRow = () => {
    rows['timeIn'] = sessionDate
    add({ ...rows })
    setModalOpen(false)
  }

  const deleteRows = () => {
    for (i = 0; i < rowsSelected.length; i++) {
      remove(rowsSelected[i])
    }
  }

  let Contents = () => <span>Loading...</span>
  if (!loading) {
    if (!rows.length) {
      Contents = () => <span>No data found</span>
    } else {
      Contents = () => (
        <ReactTabulator columns={columns} data={items} options={tableOptions} cellEdited={onCellEdited} />
      )
    }
  }

  return (
    <div>
      <Segment>
        Sessions list
        <span style={{ float: 'right', right: '0px' }}>
          <DatePicker
            selected={sessionDate}
            dateFormat="dd/MM/yyyy h:mm aa"
            onChange={date => setSessionDate(date)}
            showTimeSelect
          />
          <Button size="mini" onClick={deleteRows} color="red" type="button">
            Delete
          </Button>
          <Modal
            style={{ marginTop: '0px', marginLeft: 'auto', marginRight: 'auto' }}
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            trigger={
              <Button size="mini" color="black" onClick={() => setModalOpen(true)}>
                Add
              </Button>
            }
          >
            <Modal.Header>Add an attendee</Modal.Header>
            <Modal.Content>
              <Form>
                <Form.Input label="Member Name" name="memberName" onChange={inputChange} />
                <Form.Input label="Name" name="name" onChange={inputChange} />
                <Form.Input type="integer" label="Duration" name="duration" onChange={inputChange} />
                <Form.Input type="integer" label="Price (¢)" name="price" onChange={inputChange} />
                <Button onClick={addANewRow} type="submit" color="green">
                  Save
                </Button>
              </Form>
            </Modal.Content>
          </Modal>
        </span>
      </Segment>
      <Contents />
    </div>
  )
}

List.propTypes = {
  loading: PropTypes.bool.isRequired,
  items: PropTypes.array,
  remove: PropTypes.func.isRequired,
  update: PropTypes.func.isRequired,
  add: PropTypes.func.isRequired
}
export default List
