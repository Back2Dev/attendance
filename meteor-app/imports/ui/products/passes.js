import React, { Component } from 'react'
import Checkout from '../purchase/checkout';
import './products.css'

export default class Passes extends Component {
    state = {
        passCost: 500,
        passes: 0,
        total: 0
    }

    handlePassChange = (e) => {
        const passNumber = e.target.value
        this.setState({passes: passNumber})
    }

    render() {
    //   if (this.state.isSuper) {
    //       return (
    //          <div>
    //              Allow for updating of per pass price and other price related                   info - would also require a GET user in componentDidMount, in                  order for us to determine if isSuper = true
    //              Would also require a get all products of type 'passes' and                     then a map through with the ability to update fields
    //          </div>
    //       )}
    //   else  {

        let total = this.state.passCost * this.state.passes

          return (
            <div className="product-content pass-container">
              {/* <h4>Passes</h4> */}
                <p>Passes allow you to visit Back 2 Bikes and use our equipment</p>

                <p>Each pass costs ${this.state.passCost / 100}</p>
                
                <form>
                    <label>How many Passes would you like to purchase?</label>
                    <select name="passes" id="passes" onChange={this.handlePassChange}>
                        <option value="" selected disabled>0</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                    </select>
                    {/* <input type="number" name="passes" id="passes" value={this.state.passes} onChange={this.handlePassChange}/> */}
                </form>

                <p>Your total is <strong>${total / 100}</strong></p>

                <Checkout
                    amount={total}
                    panelLabel="Total amount"
                    // {`Total $${total /100}`}
                />

            </div>
          )}
    // could add an else if (!this.state.email) for people not logged in so they can see a different view telling them to sign up - not sure how we want this flow to work at the moment.
}

