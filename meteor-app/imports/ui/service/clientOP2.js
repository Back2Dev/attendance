import React from 'react'
import { useForm } from 'react-hook-form'

function FormTrial() {
  const { register, handleSubmit, errors } = useForm({
    //this will autofocus to the 1st invalid
    submitFocusError: true
  })
  const onSubmit = data => console.log(data)
  console.log(errors)

  // const validate = (value) => {
  //   if (!input.value) {
  //     return !valid
  //   }
  // };

  const theform = document.getElementById('service-customer')
  return (
    <form onSubmit={handleSubmit(onSubmit)} id="service-customer">
      <section className="form-left">
        <article className="form customer-details">
          <legend>Customer Details</legend>
          <label className="service-form-label">
            <input
              type="text"
              name="Customer Name"
              ref={register({
                // validate: { validate },
                pattern: /\W+/,
                required: true
              })}
              className="service-form-input"
            />
            <span className="placeholder"> Customer Name</span>
          </label>
          <label className="service-form-label">
            <input
              type="email"
              name="Email"
              ref={register({ pattern: /\W+/, required: true })}
              className="service-form-input"
            />
            <span className="placeholder"> Email</span>
          </label>
          <label className="service-form-label">
            <input type="text" name="Phone" ref={register({ min: 8, required: true })} className="service-form-input" />
            <span className="placeholder"> Phone</span>
          </label>
        </article>
        <article className="form bike-details">
          <legend>Bike Details</legend>
          <label className="service-form-label">
            <input type="text" name="bikeBrand" ref={register({ required: true })} className="service-form-input" />
            <span className="placeholder"> Bike Brand</span>
          </label>
          <label className="service-form-label">
            <input type="text" name="bikeName" ref={register({ required: true })} className="service-form-input" />
            <span className="placeholder"> Bike Name</span>
          </label>
          <label className="service-form-label">
            <input type="text" name="bikeColor" ref={register({ required: true })} className="service-form-input" />
            <span className="placeholder"> Bike Color</span>
          </label>
        </article>
      </section>
      <section className="form-right">
        <article className="form misc-details">
          <legend>Misc</legend>
          <label>
            Replacement Bike Requested:
            <input type="checkbox" placeholder="replacement" name="replacement" ref={register} />
          </label>
          <label>
            Urgent?
            <input type="checkbox" placeholder="urgent" name="urgent" ref={register} />
          </label>
          <label>
            Sentimental?
            <input type="checkbox" placeholder="sentimental" name="sentimental" ref={register} />
          </label>
        </article>
        {errors.multipleErrorInput && errors.multipleErrorInput.type === 'required' && 'required'}

        <button type="submit" id="service-form-button">
          Submit{' '}
        </button>
        {/* <button onClick={theform.reset()}></button> */}
      </section>
    </form>
  )
}

export default FormTrial
