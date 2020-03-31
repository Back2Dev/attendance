import React, { useContext } from 'react'
import { ServiceContext } from './service-context'
import { Formik, Form, useField } from 'formik'
import * as Yup from 'yup'
import { Header, Segment, Input, Button, Checkbox, Icon } from 'semantic-ui-react'

const Client = () => {
  const [state, setState] = useContext(ServiceContext)

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Required'),
    email: Yup.string().required('Required'),
    phone: Yup.string().required('Required'),
    brand: Yup.string().required('Required')
  })

  const TextInput = ({ label, ...props }) => {
    const [field, meta] = useField(props)
    return (
      <div style={{ marginTop: '10px' }}>
        <b>{label}</b>
        <Input className="text-input" placeholder={label} {...field} {...props} fluid />
        {meta.touched && meta.error ? (
          <div className="error" style={{ color: 'red' }}>
            {meta.error}
          </div>
        ) : null}
      </div>
    )
  }

  return (
    <Formik
      initialValues={{
        name: '',
        email: '',
        phone: '',
        brand: '',
        model: '',
        colour: '',
        replacement: false,
        urgent: false,
        sentimental: false
      }}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        setState({ ...state, formData: values })
        setSubmitting(false)
        // resetForm({})
      }}
    >
      <Form>
        <Segment>
          <Header content="Customer Details" dividing />
          <TextInput id="name-input" label="Name" name="name" />
          <TextInput id="email-input" label="Email" name="email" />
          <TextInput id="phone-input" label="Phone" name="phone" />
        </Segment>
        <Segment>
          <Header content="Bike Details" dividing />
          <TextInput id="brand-input" label="Brand" name="brand" />
          <TextInput id="model-input" label="Model" name="model" />
          <TextInput id="colour-input" label="Colour" name="colour" />
        </Segment>
        <Segment>
          <Header content="Misc" dividing />
          <Checkbox label="Replacement Bike Requested" name="replacement" />
          <br />
          <Checkbox label="Urgent" name="urgent" />
          <br />
          <Checkbox label="Sentimental" name="sentimental" />
        </Segment>
        <Button type="submit" id="service-form-button" content="Submit" color="blue" />
      </Form>
    </Formik>
  )
}

export default Client
