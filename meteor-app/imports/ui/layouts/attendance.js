import React from "react";
import { Sidebar, Menu, Icon } from "semantic-ui-react";
import { Switch, Route } from "react-router-dom";
import NotFound from "/imports/ui/not-found";
import MemberAddContainer from "/imports/ui/member/member-add-container";
import AssessmentAddContainer from "/imports/ui/assessment/assessment";
import { Meteor } from "meteor/meteor";

import MemberEdit from "/imports/ui/member/member-edit";
import MemberMainContainer from "/imports/ui/member-main-container";
import MemberVisitContainer from "/imports/ui/member/member-visit-container";
import AdminContainer from "/imports/ui/admin/admin-container";
import AppSelection from "/imports/ui/admin/app-selection";
import "/imports/ui/layouts/attendance.css";
import Nav from "/imports/ui/member/member-nav";
import Alert from "react-s-alert";

const Attendance = () => {
  const uploadXL = e => {
    e.preventDefault();

    const file = e.target[0].files[0];
    const msg = file
      ? `Adding your parts`
      : `Oops! Forgot to add the file? Try again uploading the file`;
    Alert.info(msg);
    const reader = new FileReader();
    reader.onloadend = function() {
      const data = reader.result;
      Meteor.callAsync("parts.load", data);
    };
    reader.readAsBinaryString(file);
  };
  
  return (
    <div className="attendance-wrapper">
      <title>Back 2 Bikes | Attendance</title>
      <Nav />
      <div style={{ marginTop: "70px", height: "100%" }}>
        <Switch>
          <Route path="/admin" component={(props) => (<AppSelection uploadXL={uploadXL} {...props} />)} />
          <Route path="/userprofiles" component={AdminContainer} />
          <Route path="/add" component={MemberAddContainer} />
          <Route path="/assessment" component={AssessmentAddContainer} />

          <Route path="/:id" component={MemberVisitContainer} />
          <Route path="/" component={MemberMainContainer} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </div>
  );
};

export default Attendance;
