import React from 'react'
import { Sidebar, Menu, Icon } from 'semantic-ui-react'
import { Switch, Route } from 'react-router-dom'
import NotFound from '/imports/ui/not-found'
import Layout from '/imports/ui/ordering/layout'
import '/imports/ui/layouts/attendance.css'
import Nav from '/imports/ui/ordering/navbar'
import Alert from 'react-s-alert';

const Ordering = () => {
    return (
      <div className='ordering-wrapper'>
        <title>Back2Bikes | Ordering</title>
        <Nav />
        <div style={{ marginTop: '70px', height: '100%' }}>
          <Switch>
            <Route path="/" component={Layout} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </div>
    </div>
  )
}

export default Ordering