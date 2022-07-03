import { Meteor } from 'meteor/meteor'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'

const debug = require('debug')('app:error-boundary')
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, pathname: props.location.pathname, message: '' }
  }

  static getDerivedStateFromProps(props, state) {
    const { pathname } = props.location
    if (pathname !== state.pathname) {
      // try to clear error when location changed
      return {
        hasError: false,
        pathname,
      }
    }
    return { pathname }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    // logErrorToMyService(error, errorInfo);
    debug(this.props.location, error, errorInfo)
    const newState = Object.assign({}, this.state)
    newState.message = error.message
    this.setState(newState)
  }

  render() {
    const { msg, goBack } = this.props
    if (this.state.hasError) {
      return (
        <div style={{ textAlign: 'center', padding: '24px' }}>
          <img src="/images/oops.jpeg"></img>
          <h2>{msg}</h2>
          {Meteor.settings.public.environment === 'dev' && (
            <>
              <pre>{this.state.message}</pre>
              <p>
                <i>More details in the browser console log</i>
              </p>
            </>
          )}
          <div>
            <button onClick={() => this.props.history.goBack()}>{goBack}</button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  msg: PropTypes.string,
  goBack: PropTypes.string,
}

ErrorBoundary.defaultProps = {
  msg: 'Oh no! Something went wrong',
  goBack: 'Go Back',
}

export default withRouter(ErrorBoundary)
