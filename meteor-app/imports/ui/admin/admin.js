import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom'
import MemberCardSmall from "/imports/ui/member/member-card-small";
import { Grid } from "semantic-ui-react";
import AdminMemberList from '/imports/ui/admin/admin-member-list'

const renderMergedProps = (component, ...rest) => {
  const finalProps = Object.assign({}, ...rest);
  return (
    React.createElement(component, finalProps)
  );
}

const PropsRoute = ({ component, ...rest }) => {
  return (
    <Route {...rest} render={routeProps => {
      return renderMergedProps(component, routeProps, rest);
    }} />
  );
}

class Admin extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Grid centered>
        <Grid.Column width={12}>
          <h1>Admin</h1>
          <Switch>
            <PropsRoute path="/" component={AdminMemberList} {...this.props} />
          </Switch>
        </Grid.Column>
      </Grid>
    )
  }
}

Admin.propTypes = {
  members: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  removeMember: PropTypes.func.isRequired,
};

export default Admin
