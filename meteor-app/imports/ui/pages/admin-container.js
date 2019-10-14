import React from "react";
import { Meteor } from 'meteor/meteor'
import { Switch, Route } from 'react-router-dom'

import { uploadPartsPrices } from '/imports/api/meteor-utils'
import AdminContainer from '/imports/ui/admin/admin-container'
import WwccContainer from '/imports/ui/wwcc'
import SlsaContainer from '/imports/ui/slsa'
import DupesContainer from '/imports/ui/dupes'
import RenewalsContainer from '/imports/ui/renewals/container'
import AppSelection from '/imports/ui/admin/app-selection'


const Home = props => <div>Home is where the heart is</div>

export default Admin = props => {
  return (
    <Switch>
      <Route path="/admin" exact component={props => <AppSelection uploadMethod={uploadPartsPrices} {...props} />} />
      <Route path="/xadmin" component={Home}></Route>
      <Route path="/admin/userprofiles" component={AdminContainer} />
      <Route path="/admin/wwcc" component={WwccContainer} />
      <Route path="/admin/slsa" component={SlsaContainer} />
      <Route path="/admin/duplicates" component={DupesContainer} />
      <Route path="/admin/renewals" component={RenewalsContainer} />

      <Route path="/superadmin/users" component={AdminContainer} />
    </Switch>

  )
}
