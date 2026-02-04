import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Shop from '.'
import { AlertProvider } from '/imports/ui/utils/alert'

const ShopIframe = props => {
  return (
    <AlertProvider>
      <div style={{ height: '100%' }}>
        <Switch>
          <Route path="/" component={Shop} />
        </Switch>
      </div>
    </AlertProvider>
  )
}

export default ShopIframe
