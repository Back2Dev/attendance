import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Route, Switch } from 'react-router-dom'
import { Grid } from 'semantic-ui-react'
import UploadXL from '/imports/ui/ordering/uploadXL'
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

const Admin = props => {
  const toggleNOOP = () => { }

  return (
    <Grid centered>
      <Grid.Column width={12}>
        <h2> Surf Life Saving Admin</h2>
        <UploadXL uploadXL={props.uploadXL} toggleAddPart={toggleNOOP}></UploadXL>
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
  uploadXL: PropTypes.func.isRequired
}

export default Admin
