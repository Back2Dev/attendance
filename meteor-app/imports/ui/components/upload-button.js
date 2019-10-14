import React from "react"
import PropTypes from "prop-types"
import { Grid } from "semantic-ui-react"
import { Button, Form, Input, Header } from "semantic-ui-react"
import './upload-button.css'

const UploadButton = ({ uploadMethod, toggle, header, input, prompt }) => {

  const [inputValue, setInput] = React.useState('')

  return (
    <Form
      className="upload-button"
      action=""
      onSubmit={e => {
        if (toggle) toggle();
        uploadMethod(e, inputValue);
      }}
    >
      <Header> {header} </Header>
      <Grid centered>
        <Grid.Row>
          <Input type="file" />
        </Grid.Row>
        {input &&
          <Grid.Row>
            {prompt}<br />
            <Input type="text" name={input} onChange={(e) => setInput(e.target.value)} />
          </Grid.Row>
        }
        <Grid.Row>
          <Button type="submit" content="Submit file" icon="inbox" positive />
        </Grid.Row>
      </Grid>
    </Form>

  )
}

UploadButton.propTypes = {
  uploadMethod: PropTypes.func.isRequired
}

export default UploadButton
