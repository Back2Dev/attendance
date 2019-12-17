import React from 'react'
import { Sidebar, Menu, Icon } from 'semantic-ui-react'
import { Switch, Route } from 'react-router-dom'
import NotFound from '/imports/ui/not-found'
import Shop from '.'
import Alert from 'react-s-alert'
import 'react-s-alert/dist/s-alert-default.css'
import { alertsConfig } from '/imports/ui/config/alerts'

const ShopIframe = props => {
  return (
    <div style={{ height: '100%' }}>
      {/* <Alert {...alertsConfig} /> */}
      <Switch>
        <Route path="/" component={Shop} />
      </Switch>
    </div>
  )
}

export default ShopIframe
