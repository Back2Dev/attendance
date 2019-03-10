import React, { Component } from 'react'
import Checkout from '../purchase/checkout';

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
            <>
              <h4>Passes</h4>
                <p>Passes allow you to visit Back 2 Bikes and use our equipment</p>

                <p>Each pass costs ${this.state.passCost / 100}</p>
                
                <form>
                    <label>How many Passes would you like to purchase?</label>
                    <input type="number" name="passes" id="passes" value={this.state.passes} onChange={this.handlePassChange}/>
                </form>

                <p>Your total is ${total / 100}</p>

                <Checkout
                    amount={total}
                    panelLabel="Total amount"
                    // {`Total $${total /100}`}
                />

              </>
          )}
    // could add an else if (!this.state.email) for people not logged in so they can see a different view telling them to sign up - not sure how we want this flow to work at the moment.
}

