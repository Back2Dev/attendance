import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Frame from '../frame'
import dataCache from '../data-cache'

export const Placeholder = ({ pid }) => {
  const part = dataCache.getQuestion(pid)
  const [details, setDetails] = useState(false)
  return (
    <Frame pid={pid}>
      The part specified is unimplemented or an invalid type.
      <pre>
        type: {part.type} <br />
        {details && JSON.stringify(part, null, 2)}
      </pre>
      <button onClick={() => setDetails(!details)}>
        Show {details ? 'less' : 'more'}
      </button>
    </Frame>
  )
}

Placeholder.propTypes = {
  pid: PropTypes.string,
}
