import React from 'react'

function client() {
  // Bike Details
  const [brand, setBrand] = useState('')
  const [bikeName, setBikeName] = useState('')
  const [color, setColor] = useState('')

  // Customer Details
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  //Order Options
  const [replacementBike, setReplacementBike] = useState('')
  const [urgent, setUrgent] = useState('')
  const [sentimental, setSentimental] = useState('')

  const handleSubmit = e => {
    e.preventDefault()
    alert(`Submitting Name ${name}`)
  }
  return (
    <form onSubmit={handleSubmit}>
      
      <legend>Bike Details</legend>
      <label htmlFor="bikeDetails">
        <span></span>
        <input id="bikeDetails" type="text" value={brand} onChange={e => setBrand(e.target.value)} />
        <input id="bikeDetails" type="text" value={bikeName} onChange={e => setBikeName(e.target.value)} />
        <input id="bikeDetails" type="text" value={color} onChange={e => setColor(e.target.value)} />
      </label>
      
      <legend>Customer Details</legend>
      <label htmlFor="customerDetails">
        <span></span>
        <input id="customerDetails" type="text" value={name} onChange={e => setName(e.target.value)} />
        <input id="customerDetails" type="text" value={email} onChange={e => setEmail(e.target.value)} />
        <input id="customerDetails" type="text" value={phone} onChange={e => setPhone(e.target.value)} />
      </label>

      <legend>Options</legend>
      <label htmlFor="optionDetails">
        <input type="checkbox" id="optionDetails" name="vehicle1" value="Bike" />
      </label>
      <label htmlFor="CustomerDetails">
        <input type="checkbox" id="optionDetails" name="vehicle1" value="Bike" />
      </label>
      <label htmlFor="CustomerDetails">
        <input type="checkbox" id="optionDetails" name="vehicle1" value="Bike" />
      </label>
      </label>
      <input type="submit" value="Submit" />
    </form>
  )
}

export default client
