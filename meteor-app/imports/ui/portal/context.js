import * as React from 'react'
import { cloneDeep } from 'lodash'

const debug = require('debug')('b2b:visit-context')

const VisitContext = React.createContext()

const steps = { pinmatch: 'select-activity' }

const initialState = {}

const nextStep = action => {
  if (action.payload && steps[action.payload]) return steps[action.payload]
  return 'unknown-next-step'
}

const reducer = (state, action) => {
  debug(`Dispatch: ${action.type}`, action.payload)
  switch (action.type) {
    case 'next':
      const where = state.member.isHere ? 'sign-out' : nextStep(action)
      state.history.push(`/visit/${state.member._id}/${where}`)
    case 'reset':
      return cloneDeep(initialState)
    default:
      return { ...state }
  }
}

function VisitContextProvider(props) {
  const [state, dispatch] = React.useReducer(reducer, props || initialState)
  const value = { state, dispatch }
  // cartUpdater = props.cartUpdate

  return <VisitContext.Provider value={value}>{props.children}</VisitContext.Provider>
}

VisitContextProvider.propTypes = {}

const VisitContextConsumer = VisitContext.Consumer

export { VisitContext, VisitContextProvider, VisitContextConsumer }
