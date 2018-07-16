import React, { Fragment } from 'react'
import { withRouter } from 'react-router-dom'
import { Grid } from 'semantic-ui-react'

import PartCard from '/imports/ui/ordering/ordering-part-card'
import PartList from '/imports/ui/ordering/ordering-part-list'

class Ordering extends React.Component {

  render() {
    return (
      <Grid>
        <Grid.Row>
          <Grid.Column width='13'>
            <div><h1>List of parts rendered here </h1>
              <PartList
                title={'Part Title:'}
                parts={this.props.parts}
                Component={PartCard}
                componentClassName='part-card-main'
                loading={this.props.loading}
              />
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}

export default withRouter(Ordering)
