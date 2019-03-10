import React, { Component } from 'react'
import Checkout from '../purchase/checkout'
import './products.css'

export default class Memberships extends Component {

    state = {
      selected: '3-month',
      total: 0,
    }

    handleFrequencyChange = (e) => {
        this.setState({
            selectedOption: e.target.value
        })
        calcTotal()
        console.log(selectedOption)
    }

    calcTotal = () => {
          if (this.state.selectedOption === "threeMonth"){
            this.setState({total: 6000})
        }
        else if (this.state.selectedOption === "sixMonth"){
            this.setState({total: 6000})
        }
        else if (this.state.selectedOption === "twelveMonth"){
            this.setState({total: 6000})
        }
        else {
            this.setState({total: 6000})
        }

    }
      


    render() {

          return (
              <div className="product-content membership-container">
              
              <h4>Membership Types</h4>
                <p>Memberships allow you to access and use the facilities at Back 2 Bikes.</p>
                <form>
                    <div className="form-check">
                        <label htmlFor="frequency">3 Month Membership</label>
                        <input type="radio" id="threeMonthMembership" value="threeMonth" name="frequency" checked={this.state.selectedOption === "threeMonth"} onChange={this.handleFrequencyChange}/>
                    </div>

                    <div className="form-check">
                        <label htmlFor="frequency">6 Month Membership</label>
                        <input type="radio" id="sixMonthMembership" value="sixMonth" name="frequency" checked={this.state.selectedOption === "sixMonth"} onChange={this.handleFrequencyChange}/>
                    </div>

                    <div className="form-check">
                        <label htmlFor="frequency">12 Month Membership</label>
                        <input type="radio" id="twelveMonthMembership" value="twelveMonth" name="frequency" checked={this.state.selectedOption === "twelveMonth"} onChange={this.handleFrequencyChange}/>
                    </div>
                </form>
            {this.state.isSubmitted && email && <Payment {...this.props} email={email} selectedOption={selectedOption} />}
              
              <p>current total is {this.state.total}</p>
                <Checkout
                    amount={this.state.total}
                />
              </div>
          )
        }

}

// submitForm = (e) => {
//     e.preventDefault()

    // const {  firstName, lastName, email, password, session, phone, streetAddress, suburb, postcode, ausState, dateJoined, numberOfOrders, stripeId, active, admin, selectedOption, passwordConfirm} = this.state
    // const url = `${process.env.REACT_APP_DOMAIN}/end point`

    // if(password === passwordConfirm){

    //   const data = { firstName, lastName, email, password, session, phone, streetAddress, suburb, postcode, ausState, dateJoined, numberOfOrders, stripeId, active, admin, selectedOption }
    
    //   axios.post(url, data)
    //   .then(resp => {
    //     this.setState({ message: 'congratulations you have just purchased a Back 2 Bikes membership', error: null, isSubmitted: true })
    //     const {token} = resp.data
    //     Cookies.set('token', token)
    //     this.props.setToken(token) 
    //     // console.log(resp)
    //   })
    //   .catch(err => {
    //       console.log(err.response)
    //       if (err.response === 403) {
    //         this.setState({ error: 'Nope!', message: null})
    //       }
    //   })
    // } else {
    //   this.setState({passwordMsg: "passwords do not match!"})
    // }
    