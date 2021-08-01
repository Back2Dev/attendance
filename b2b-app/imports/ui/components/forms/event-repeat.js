import { Meteor } from 'meteor/meteor'
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connectField } from 'uniforms'
import { TextField } from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import styled from 'styled-components'
import { useTracker } from 'meteor/react-meteor-data'
import Tools from '/imports/api/tools/schema.js'
import { ToolItemSchema } from '/imports/api/events/schema.js'

const StyledEventRepeat = styled.div`
  margin: 10px 0;
`

const EventRepeat = ({ className, disabled, onChange, value, label }) => {
  // console.log({ value })
  const [factor, setFactor] = useState(value?.factor ? value.factor : 'week')
  const [every, setEvery] = useState(value?.every || null)
  const [dow, setDow] = useState(value?.dow || null)
  const [dom, setDom] = useState(value?.dom || null)
  const [util, setUtil] = useState(value?.util || null)

  const renderSummary = () => {
    return null
  }

  return <StyledEventRepeat>{renderSummary()}</StyledEventRepeat>
}

EventRepeat.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.shape({
    factor: PropTypes.string,
    every: PropTypes.number,
    dow: PropTypes.number,
    dom: PropTypes.number,
    util: Date,
  }),
  disabled: PropTypes.bool,
  label: PropTypes.string,
}

const ToolsField = connectField(EventRepeat)

export default ToolsField
