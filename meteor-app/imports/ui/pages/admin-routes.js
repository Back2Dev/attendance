import React from 'react'
import { Switch, Route } from 'react-router-dom'

import AdminContainer from '/imports/ui/admin/admin-container'
import WwccContainer from '/imports/ui/wwcc'
import SlsaContainer from '/imports/ui/slsa'
import DupesContainer from '/imports/ui/dupes'
import RenewalsContainer from '/imports/ui/renewals/container'
import MatchingContainer from '/imports/ui/matching'
import MemberDetails from '/imports/ui/admin/member'
import MemberList from '/imports/ui/admin/member-list'
import EventContainer from '/imports/ui/events/lister'
import ProductContainer from '/imports/ui/products/lister'
import PromoContainer from '/imports/ui/promos/lister'
import PartContainer from '/imports/ui/parts/lister'
import SessionsContainer from '/imports/ui/sessions/lister'
import ServiceItemContainer from '/imports/ui/service-items/lister'

// const Home = props => <div>Home is where the heart is (admin-container.js)</div>

export default Admin = props => {
  return (
    <Switch>
      {/* <Route path="/xadmin" component={Home}></Route> */}
      <Route path="/admin/useradmin" exact component={AdminContainer} />
      <Route path="/admin/userprofiles" component={AdminContainer} />
      <Route path="/admin/userprofiles/:id" component={MemberDetails} />
      <Route path="/admin/wwcc" component={WwccContainer} />
      <Route path="/admin/slsa" component={SlsaContainer} />
      <Route path="/admin/duplicates" component={DupesContainer} />
      <Route path="/admin/renewals" component={RenewalsContainer} />
      <Route path="/admin/matching" component={MatchingContainer} />

      <Route path="/superadmin/users" component={AdminContainer} />

      <Route path="/admin/events" component={EventContainer} />
      <Route path="/admin/products" component={ProductContainer} />
      <Route path="/admin/promos" component={PromoContainer} />
      <Route path="/admin/parts" component={PartContainer} />
      <Route path="/admin/sessions" component={SessionsContainer} />
      <Route path="/admin/service-items" component={ServiceItemContainer} />
    </Switch>
  )
}
