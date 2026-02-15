import React from 'react'
import { Route, Switch } from 'react-router-dom'
import FormWrapper from './form-wrapper'
import './index.css'
import dbg from 'debug'
const debug = dbg('app:forms')

const Main = () => (
  <Switch>
    <Route path="/forms/:token" exact component={FormWrapper} />
  </Switch>
)

export default Main
