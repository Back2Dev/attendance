import React from "react";
import PropTypes from "prop-types";
import Alert from "react-s-alert";
import { Grid } from "semantic-ui-react";
import { Button, Form, Input, Header, Transition } from "semantic-ui-react";
import '/imports/ui/ordering/uploadXL.css'

const UploadXL = ({ uploadXL, toggleAddPart }) => (
  <Form
    className="uploadXL"
    action=""
    onSubmit={e => {
      toggleAddPart();
      uploadXL(e);
    }}
  >
    <Header> Upload your xlsx file! </Header>
    <Grid centered>
      <Grid.Row>
        <Input type="file" />
      </Grid.Row>
      <Grid.Row>
        <Button type="submit" content="Submit file" icon="inbox" positive />
      </Grid.Row>
    </Grid>
  </Form>

);

UploadXL.propTypes = {
  uploadXL: PropTypes.func.isRequired
};

export default UploadXL;
