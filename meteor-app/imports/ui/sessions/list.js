import React from 'react'
import PropTypes from 'prop-types'
import { Button, Segment, Modal, Form, Dropdown } from 'semantic-ui-react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import 'react-tabulator/lib/styles.css'
import 'react-tabulator/lib/css/semantic-ui/tabulator_semantic-ui.min.css'
import { ReactTabulator } from 'react-tabulator'
import moment from 'moment'

const debug = require('debug')('manx:add')

const AddModal = props => {
  return (<Modal
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
        <Form.Dropdown
          label="Member Name"
          placeholder="Select Member"
          onChange={inputMember}
          options={memberOptions}
          search
          fluid
        />
        <Form.Dropdown
          label="Session Name"
          placeholder="Select Session"
          onChange={inputEvent}
          options={eventOptions}
          search
          fluid
        />
        <Button onClick={addANewRow} type="submit" color="green">
          Save
        </Button>
      </Form>
    </Modal.Content>
  </Modal>)
}
const List = ({ items, members, events, update, remove, add, columns, loading }) => {
  const [rows, setRows] = React.useState(items)
  const [rowsSelected, setRowsSelected] = React.useState([])
  const [sessionDate, setSessionDate] = React.useState(Session.get('filterDate'))
  const [modalOpen, setModalOpen] = React.useState(false)

  React.useEffect(() => {
    setRows(items)
    setRowsSelected([])
  }, [items])

  const onCellEdited = cell => {
    debug('cellEdited', cell)
    update(cell._cell.row.data)
  }

  const pickDate = date => {
    setSessionDate(date)
    Session.set('filterDate', date)
  }

  const tableOptions = {
    cellEdited: onCellEdited,
    width: 100,
    rowSelected: function (row) {
      rowsSelected.push(row._row.data._id)
      setRowsSelected(rowsSelected)
    },
    rowDeselected: function (row) {
      for (i = 0; i < rowsSelected.length; i++) {
        if (rowsSelected[i] === row._row.data._id) {
          rowsSelected.splice(i, 1)
          setRowsSelected(rowsSelected)
        }
      }
    }
  }

  const inputMember = (_, { value, options }) => {
    rows['memberId'] = value
    const selectedMember = options.find(member => member.value === value)
    rows['memberName'] = selectedMember.text
    setRows(rows)
  }

  const inputEvent = (_, { value }) => {
    const selectedEvent = events.find(event => event._id === value)
    rows['name'] = selectedEvent.name
    rows['duration'] = selectedEvent.duration
    rows['price'] = selectedEvent.price
    rows['timeOut'] = moment(sessionDate)
      .add(selectedEvent.duration, 'hours')
      .toDate()
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
        <ReactTabulator
          columns={columns}
          data={items.sort((a, b) => b.createdAt - a.createdAt)}
          options={tableOptions}
          cellEdited={onCellEdited}
        />
      )
    }
  }

  const buttons = [
    { action: deleteRows, id: 'delete', caption: 'Delete', color: 'red' },
    // Not a standard button, as it is tied up with a modal form
    { action: addANewRow, id: 'add', caption: 'Add', color: 'black', component }
  ]

  const memberOptions = members
    .map(member => ({
      key: member._id,
      text: member.name,
      value: member._id,
      image: { avatar: true, src: '/images/avatars/' + member.avatar }
    }))
    .sort((a, b) => a.text.localeCompare(b.text))

  const eventOptions = events
    .map(event => ({
      key: event._id,
      text: event.name,
      value: event._id
    }))
    .sort((a, b) => a.text.localeCompare(b.text))

  return (
    <div>
      <Segment>
        Sessions list
        <span style={{ float: 'right', right: '0px' }}>
          <DatePicker
            selected={sessionDate}
            dateFormat="dd/MM/yyyy h:mm aa"
            onChange={date => pickDate(date)}
            showTimeSelect
          />
          {buttons.map(btn => (
            <Button id={btn.id} key={btn.id} size="mini" onClick={btn.action} color={btn.color} type="button">
              {btn.caption}
            </Button>
          ))}

        </span>
      </Segment>
      <Contents />
    </div>
  )
}

List.propTypes = {
  loading: PropTypes.bool.isRequired,
  items: PropTypes.array,
  members: PropTypes.array,
  events: PropTypes.array,
  remove: PropTypes.func.isRequired,
  update: PropTypes.func.isRequired,
  add: PropTypes.func.isRequired
}
export default List
