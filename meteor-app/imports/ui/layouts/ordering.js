import React from 'react'
import { Switch, Route } from 'react-router-dom'
import NotFound from '/imports/ui/not-found'
import Layout from '/imports/ui/ordering/layout'
import '/imports/ui/layouts/attendance.css'
import Nav from '/imports/ui/ordering/navbar'
import Cart from '/imports/ui/ordering/cart-layout'

const Ordering = () => {
    return (
      <div className='ordering-wrapper'>
        <title>Back2Bikes | Ordering</title>
        <Nav />
        <div style={{ marginTop: '70px', height: '100%' }}>
          <Switch>
            <Route path="/ordering/cart" component={Cart} />
            <Route path="/" component={Layout} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </div>
    )
}

export default Ordering
