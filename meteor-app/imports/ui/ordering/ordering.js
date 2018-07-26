import React from "react";
import { withRouter } from "react-router-dom";
import {
  Grid,
  Container,
  Header,
  Input,
  Button,
  Dimmer,
  Loader,
  Image,
  Message,
  Segment,
  Icon
} from "semantic-ui-react";
import PartCard from "/imports/ui/ordering/ordering-part-card";
import PartList from "/imports/ui/ordering/ordering-part-list";
import CartIcon from "/imports/ui/ordering/cart-icon";

class Ordering extends React.Component {
  render() {
    if (this.props.loading) {
      return (
        <div>
          <Dimmer active inverted>
            <Loader size="huge">Loading... </Loader>
          </Dimmer>

          <Image src="/images/wireframe/short-paragraph.png" />
        </div>
      );
    }
    const { activeOrder, uploadXL } = this.props;
    let noOfParts = 0;

    return (
      <Grid container columns="equal">
        {!this.props.loading &&
          activeOrder &&
          activeOrder.orderedParts.forEach(part => {
            noOfParts += part.qty;
            return noOfParts;
          })}

        <Grid.Row columns={1}>
          <Grid.Column width={16}>
            <Header as="h2" textAlign="center">
              {" "}
              <div>Back2Bikes Parts Search</div>{" "}
            </Header>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={1} centered>
          <CartIcon noOfParts={noOfParts} />
          <br />
          <Input
            placeholder="Search Part Number"
            onChange={this.props.onSearchInput}
            value={this.props.partSearchQuery}
            icon={"search"}
            size="massive"
          />{" "}
        </Grid.Row>

        <Grid.Row columns={1} centered>
          {this.props.parts < 1 ? (
            <Message
              icon="inbox"
              header="Oops, no pricelist data available"
              content="Please upload your pricelist through the admin panel"
            />
          ) : (
            ""
          )}
        </Grid.Row>

        <Grid.Row>
          <Grid.Column>
            <PartList
              title={"Part Title:"}
              parts={this.props.parts}
              activeOrder={this.props.activeOrder}
              addToCart={this.props.addToCart}
              Component={PartCard}
              componentClassName="part-card-main"
              loading={this.props.loading}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default withRouter(Ordering);
