import React from 'react'
import { Header, Button } from 'semantic-ui-react'
import EnterPin from './enter-pin'

const Depart = props => {
  return <EnterPin {...props} next="sign-out" />
}

export default Depart
