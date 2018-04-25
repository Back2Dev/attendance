import React, {Component} from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'

import Header from './Header'
import SearchablePeople from './SearchablePeople'
import CheckedInList from './CheckedInList'
import CheckinList from './CheckinList'
import ConfirmCheckin from './ConfirmCheckin'
import ConfirmCheckout from './ConfirmCheckout'
import AttendanceApp from '../layouts/AttendanceApp'

import { Container } from 'semantic-ui-react'

class App extends Component {
  render () {
    return (
      <Container>
        <Route path='*' component={Header}/>
          <Switch>
            <Route path='/attendance' component={AttendanceApp} />
            <Route path='/people/list' render={() => <SearchablePeople backgroundColor={'FloralWhite'}/>} />
            <Route path='/people/whosIn' component={CheckedInList} />
            <Route path='/people/checkIn' component={CheckinList} />
            <Route path='/people/:id/confirmCheckin' component={ConfirmCheckin} />
            <Route path='/people/:id/confirmCheckout' component={ConfirmCheckout} />
          </Switch>
      </Container>
    )
  }
}
export default withRouter(App)