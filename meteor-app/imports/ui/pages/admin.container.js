import React from "react";
import { withTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import { Stuffs } from "/imports/api/stuff/stuff";
import ListStuff from "./admin";

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  // Get access to Stuff documents.
  const subscription = Meteor.subscribe("Stuff");
  return {
    stuffs: Stuffs.find({}).fetch(),
    ready: subscription.ready()
  };
})(ListStuff);
