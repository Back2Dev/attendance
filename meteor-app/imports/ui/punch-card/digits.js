import React from "react";
import { Card } from "semantic-ui-react";

import One from "./../one.png";

const digitStyle = {
  width: "50px",
  height: "50px"
};

class DigitsArr extends React.Component {
  render() {
    var arr = [One];
    var elements = [];
    for (var i = 0; i < 6; i++) {
      // push the component to elements!
      elements.push(<Card raised image={arr[0]} />);
    }
    return <Card.Group itemsPerRow={5}>{elements}</Card.Group>;
  }
}

export default DigitsArr;
