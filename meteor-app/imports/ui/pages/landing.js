import React from "react";
import { Grid, Image } from "semantic-ui-react";

/** A simple static component to render some text for the landing page. */
class Landing extends React.Component {
  render() {
    return (
      <Grid verticalAlign="middle" textAlign="center" container>
        <Grid.Column width={4}>
          <Image size="small" circular src="/images/b2b150.jpg" />
        </Grid.Column>

        <Grid.Column width={8}>
          <h1>Welcome to homepage</h1>
        </Grid.Column>
      </Grid>
    );
  }
}

export default Landing;
