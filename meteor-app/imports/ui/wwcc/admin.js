import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Route, Switch } from 'react-router-dom'
import { Grid } from 'semantic-ui-react'
import MemberList from './member-list'
import MemberDetails from './member'

const renderMergedProps = (component, ...rest) => {
  const finalProps = Object.assign({}, ...rest)
  return React.createElement(component, finalProps)
}

const PropsRoute = ({ component, match, ...rest }) => {
  return (
    <Route
      {...rest}
      render={routeProps => {
        return renderMergedProps(component, routeProps, rest)
      }}
    />
  )
}

class Admin extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Grid centered>
        <Grid.Column width={12}>
          <h2> Working with children check</h2>
          <Switch>
            <PropsRoute path="/wwcc" exact component={MemberList} {...this.props} />
            <PropsRoute path="/wwcc/:id" component={MemberDetails} {...this.props} />
          </Switch>
        </Grid.Column>
      </Grid>
    )
  }
}

Admin.propTypes = {
  members: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  checkWwcc: PropTypes.func.isRequired
}

export default Admin
