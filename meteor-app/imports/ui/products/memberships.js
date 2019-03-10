import React, { Component } from 'react'
import Checkout from '../purchase/checkout'

export default class Memberships extends Component {

    state = {
      selected: '3-month'
    }

    render () {
        //   if (this.state.isSuper) {
        //       return (
        //       <div>
        //           Similar to this section in passes.js - check if admin, then allow              to update membership info
        //       </div>
        //       )}
        //   else  {
      return (
          <>
            <h4>Membership Types</h4>
            <p>Memberships allow you to access and use the facilities at Back 2 Bikes.</p>

            <div>
            <label>3 month</label>
            <input type='radio' id='3-month' name='b2b-membership' value='3-month'
                checked={this.state.selected === '3-month'} onChange={(e) => this.setState({ selected: e.target.value })} />
            <br />

            <label>6 month</label>
            <input type='radio' id='6-month' name='b2b-membership' value='6-month' 
                checked={this.state.selected === '6-month'} onChange={(e) => this.setState({ selected: e.target.value })} />
                <br />

                <label>12 month</label>
            <input type='radio' id='12-month' name='b2b-membership' value='12-month' 
                checked={this.state.selected === '12-month'} onChange={(e) => this.setState({ selected: e.target.value })} />
            </div>

            <p>current total is {this.totalCost}</p>
            {this.state.selected === "3-month" && 
                <>
                    <p>Current Total is $60</p>
                    <Checkout amount={6000}/>
                </>
            }
            {this.state.selected === "6-month" && 
                <>
                    <p>Current Total is $80</p>
                    <Checkout amount={8000}/>
                </>
            }
            {this.state.selected === "12-month" && 
                <>
                    <p>Current Total is $100</p>
                    <Checkout amount={10000}/>
                </>
            }
        </>
      )
    }
  }