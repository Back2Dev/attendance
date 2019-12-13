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
        <p>
          This page can be used to upload Surf Life saving membersip information, as extracted from Surf Guard. The file
          should have the following columns:
        </p>
        <ol>
          <li>Member ID</li>
          <li>Last Name</li>
          <li>First Name</li>
          <li>Status</li>
          <li>Season</li>
          <li>Email Address 1</li>
          <li>Email Address 2</li>
          <li>Working with Children Registration Expiry Date</li>
          <li>Working with Children Registration No</li>
        </ol>
        <h2>Steps to obtain the correct file</h2>
        <h3>1) Login to Surfguard</h3>
        <p>
          <a target="_blank" href="https://www.surfguard.slsa.asn.au">
            https://www.surfguard.slsa.asn.au
          </a>
        </p>
        <p>Navigate to Reports => custom</p>
        <h3>2) Get the report template</h3>
        <p>
          There is a template file available{' '}
          <a href="/slsa-template.xml" download>
            here
          </a>
          (Click to download)
        </p>
        <h3>3) Upload the template to the Surfuard custom report</h3>
        <img src="/slsa-custom.png" style={{ border: '2px solid #ccc' }}></img>
        and click "Go"
        <h3>4) Check the selections</h3>
        <p>
          The fields selected should look like this screenshot. This selects 2919, you might need to edit it for
          subsequent years
        </p>
        <h3>5) Request the report</h3>
        <img src="/slsa-request.png" style={{ border: '2px solid #ccc' }}></img>
        <p>Select CSV output format and click "Display report"</p>
        <h3>6) Save the CSV file</h3>
        <p>It will give you a summary, and the option to save the file</p>
        <img src="/slsa-summary.png" style={{ border: '2px solid #ccc' }}></img>
        <h3>7) Upload the CSV file below</h3>
        <UploadButton
          uploadMethod={uploadMethod}
          header="Upload CSV file from Surf Guard"
          input="season"
          prompt="Enter current season (eg 2019/2020)"
        ></UploadButton>
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
