import React from 'react'
import PropTypes from 'prop-types'
import { connectField } from 'uniforms'
import dbg from 'debug'

const debug = dbg('app:table')

const DatatableField = ({ value, label, onChange }) => {
  return <span>data table</span>
}

DatatableField.propTypes = {
  value: PropTypes.object.isRequired,
}
export default connectField(DatatableField, { kind: 'leaf' })
