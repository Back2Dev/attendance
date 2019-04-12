import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Image } from 'semantic-ui-react';


function CardTest (props) {
  return (
    <Grid divided='vertically'>
      <Grid.Row columns={1}>
        <Grid.Column ><p>5265 5265 2652 2654</p></Grid.Column>
      </Grid.Row>
      <Grid.Row columns={2}>
        <Grid.Column>
          <Image src="./images/avatar.jpg"></Image>
        </Grid.Column>
        <Grid.Column>
          <Image src="./images/avatar.jpg"></Image>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}
export default CardTest
