import React, { useContext, useEffect } from 'react'
import { ServiceContext } from './service-context'
import { Formik, Form, useField } from 'formik'
import * as Yup from 'yup'
import moment from 'moment'
import { Header, Segment, Grid, Input, Button, Checkbox } from 'semantic-ui-react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const Client = () => {
  const [state, setState] = useContext(ServiceContext)

  const validationSchema = Yup.object().shape({
    name: Yup.string().max(49, 'Name must be less than 50 characters'),
    email: Yup.string().email('Email must be a valid email format'),
    phone: Yup.string()
      .min(3, 'Phone number must be greater than 2 characters')
      .max(49, 'Phone number must be less than 50 characters'),
    make: Yup.string().required('Required'),
    model: Yup.string(),
    color: Yup.string().required('Required'),
    bikeValue: Yup.number().required('Required'),
    assessor: Yup.string().required('Required').max(49, 'Name must be less than 50 characters'),
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

  const handleChange = (values) => {
    setState({ ...state, ...values })
  }
  return (
    <Formik
      initialValues={state}
      validationSchema={validationSchema}
      onSubmit={(values, { resetForm }) => {
        state.updateJob({ ...state })
        resetForm({})
      }}
    >
      {({ values, setFieldValue }) => (
        <Form onBlur={() => handleChange(values)}>
          <Grid columns={3}>
            <Grid.Column>
              <Segment>
                <Header content="Customer Details" dividing />
                <TextInput id="name-input" label="Name" name="name" />
                <TextInput id="email-input" label="Email" name="email" />
                <TextInput id="phone-input" label="Phone" name="phone" />
              </Segment>
            </Grid.Column>
            <Grid.Column>
              <Segment>
                <Header content="Bike Details" dividing />
                <TextInput id="make-input" label="Make" name="make" />
                <TextInput id="model-input" label="Model" name="model" />
                <TextInput id="colour-input" label="Colour" name="color" />
                <TextInput id="value-input" label="Value" name="bikeValue" type="number" />
              </Segment>
            </Grid.Column>
            <Grid.Column>
              <Segment>
                <Header content="Misc" dividing />
                <b>Pick Up Date</b>
                <br />
                <DatePicker
                  selected={moment(values.pickupDate).toDate()}
                  minDate={new Date()}
                  onChange={(date) => setFieldValue('pickupDate', date)}
                />
                <TextInput id="assessor" label="Assessor" name="assessor" />
                <br />
                <Checkbox
                  id="temp-bike-checkbox"
                  defaultChecked={state.temporaryBike}
                  label="Temporary Bike"
                  name="temporaryBike"
                  onChange={() => setFieldValue('temporaryBike', !values.temporaryBike)}
                />
                <br />
                <Checkbox
                  id="urgent-checkbox"
                  defaultChecked={state.urgent}
                  label="Urgent"
                  name="urgent"
                  onChange={() => setFieldValue('urgent', !values.urgent)}
                />
                <br />
                <Checkbox
                  id="sentimental-checkbox"
                  defaultChecked={state.sentimental}
                  label="Sentimental"
                  name="sentimental"
                  onChange={() => setFieldValue('sentimental', !values.sentimental)}
                />
                <br />
                <Checkbox
                  id="refurbish-checkbox"
                  defaultChecked={state.isRefurbish}
                  label="Refurbished"
                  name="isRefurbish"
                  onChange={() => setFieldValue('isRefurbish', !values.isRefurbish)}
                />
                <br />
                <Checkbox
                  defaultChecked={state.paid}
                  label="Paid"
                  name="paid"
                  onChange={() => setFieldValue('paid', !values.paid)}
                />
              </Segment>
            </Grid.Column>
          </Grid>
          <Button type="submit" id="service-form-button" content="Submit" color="blue" />
        </Form>
      )}
    </Formik>
  )
}

export default Client
