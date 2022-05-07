import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Frame } from '/imports/ui/forms/survey-builder/components/frame'
import { TypeRegistry } from '/imports/ui/forms/survey-builder/components/types/type-registry'
import {
  placeholderAtom,
  placeholderSource,
} from '/imports/ui/forms/survey-builder/recoil/atoms'
import { usePlaceholderValue } from '/imports/ui/forms/survey-builder/recoil/hooks'

/** Just pass thru the data since we don't know how to handle this type yet */
const mapDataToAtom = (data) => data

const Placeholder = ({ pid, index }) => {
  const data = usePlaceholderValue(pid)
  const [details, setDetails] = useState(false)
  return (
    <Frame pid={pid} index={index}>
      The part specified is unimplemented or an invalid type.
      <pre>
        type: {data.type} <br />
        {details && JSON.stringify(data, null, 2)}
      </pre>
      <button onClick={() => setDetails(!details)}>
        Show {details ? 'less' : 'more'}
      </button>
    </Frame>
  )
}

const InspectorProperties = () => {
  return (
    <div>
      Not rendering inspector properties because we need to know the data path we want to
      render
    </div>
  )
}

Placeholder.propTypes = {
  /** id for this Placeholder instance part */
  pid: PropTypes.string,
  /** the position this question is rendered in the parts list */
  index: PropTypes.number,
}

export { Placeholder }

TypeRegistry.register(
  'placeholder',
  Placeholder,
  placeholderSource,
  mapDataToAtom,
  placeholderAtom,
  InspectorProperties
)
