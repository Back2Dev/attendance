import React from 'react'
import RolesList from './roles-list'
import { Grid } from 'semantic-ui-react'

const RolesMain = (props) => {
  return (
    <Grid>
      <Grid.Column width={12}>
        <RolesList title={'Check In:'} roles={props.rolesOut} />
      </Grid.Column>
      <Grid.Column width={4}>
        <RolesList title={'Who\'s Here:'} roles={props.rolesIn} />
      </Grid.Column>
    </Grid>
  )
}

export default RolesMain