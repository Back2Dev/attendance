import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Route, Switch } from 'react-router-dom'
import { Grid } from 'semantic-ui-react'
import UploadButton from '/imports/ui/components/upload-button'
// import MemberList from './member-list'
// import MemberDetails from './member'

// const renderMergedProps = (component, ...rest) => {
//   const finalProps = Object.assign({}, ...rest)
//   return React.createElement(component, finalProps)
// }

// const PropsRoute = ({ component, match, ...rest }) => {
//   return (
//     <Route
//       {...rest}
//       render={routeProps => {
//         return renderMergedProps(component, routeProps, rest)
//       }}
//     />
//   )
// }

const Admin = ({ uploadMethod }) => {

  return (
    <Grid centered>
      <Grid.Column width={12}>
        <h2> Surf Life Saving Admin</h2>
        <p>This page can be used to upload Surf Life saving membersip information, as extracted from Surf Guard. The file should be of the following format...</p>
        <ul>
          <li>Member ID</li>
          <li>Last Name</li>
          <li>First Name</li>
          <li>Status</li>
          <li>Season</li>
        </ul>
        <UploadButton uploadMethod={uploadMethod} header="Upload CSV file from Surf Guard" input="season" prompt="Enter current season (eg 2019/2020)"></UploadButton>
        <Switch>
          {/* <PropsRoute path="/admin/slsa" exact component={MemberList} {...this.props} /> */}
          {/* <PropsRoute path="/admin/slsa/:id" component={MemberDetails} {...this.props} /> */}
        </Switch>
      </Grid.Column>
    </Grid>
  )
}

Admin.propTypes = {
  members: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  uploadMethod: PropTypes.func.isRequired
}

export default Admin
