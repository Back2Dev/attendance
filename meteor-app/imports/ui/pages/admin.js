import React from "react";
import { Container, Table, Header, Loader } from "semantic-ui-react";
import PropTypes from "prop-types";

const Loading = props => {
  if (!props.ready) {
    return <div>Loading</div>;
  }
  return <ListStuff {...props} />;
};

/** Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
const ListStuff = props => {
  return (
    <Container>
      <Header as="h2" textAlign="center">
        Admin{" "}
        {props.stuffs.map(stuff => (
          <div>{stuff.name}</div>
        ))}
      </Header>
    </Container>
  );
};

/** Require an array of Stuff documents in the props. */
ListStuff.propTypes = {
  stuffs: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired
};

export default ListStuff;
