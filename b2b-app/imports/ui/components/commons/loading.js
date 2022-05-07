import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { LinearProgress, CircularProgress } from '@material-ui/core'
import './loading.css'

function Loading(props) {
  const { delay, loading, message, component } = props

  const [waiting, setWaiting] = useState(delay > 0)

  useEffect(() => {
    const delayTimeout = setTimeout(() => {
      setWaiting(false)
    }, delay)
    return () => {
      clearTimeout(delayTimeout)
    }
  }, [delay])

  if (loading !== true || waiting === true) {
    return null
  }

  return (
    <div
      className={`loading-container ${component === 'circular' ? 'circular' : 'linear'}`}
    >
      {component === 'circular' ? (
        <CircularProgress className="circular-loading" />
      ) : (
        <LinearProgress className="linear-loading" />
      )}
      {message ? <div className="message">{message}</div> : null}
    </div>
  )
}

Loading.propTypes = {
  message: PropTypes.string,
  loading: PropTypes.bool,
  delay: PropTypes.number,
  component: PropTypes.string,
}

Loading.defaultProps = {
  message: '',
  loading: false,
  delay: 200,
  component: 'linear',
}

export default Loading
