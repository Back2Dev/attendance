import React, { Component } from 'react'
import Checkout from '../purchase/checkout'
import './products.css'

export default class Memberships extends Component {
    state = {
      selected: '3-month',
    }
    componentDidUpdate () {
        // alert(document.querySelector('input[name=membershipDuration]:checked').value);
    }

    // handleFrequencyChange = (e) => {
    //     this.setState({
    //         selectedOption: e.target.value
    //     })
    // }

    render() {

          return (
              <div className="product-content membership-container">
              
                <h4>Membership Types</h4>

                <p>Memberships allow you to access and use the facilities at Back 2 Bikes.</p>
                <form>
                    <div>
                    <input type='radio' id='3-month' name='membershipDuration' value='3-month'
                        checked={this.state.selected === '3-month'} onChange={(e) => this.setState({ selected: e.target.value })} />
                    <label htmlFor="frequency">3 Month Membership - $40</label>
                    </div>

                    <div>
                    <input type='radio' id='6-month' name='membershipDuration' value='6-month' 
                        checked={this.state.selected === '6-month'} onChange={(e) => this.setState({ selected: e.target.value })} />
                    <label htmlFor="frequency">6 Month Membership - $60</label>
                    </div>

                    <div>
                    <input type='radio' id='12-month' name='membershipDuration' value='12-month' 
                        checked={this.state.selected === '12-month'} onChange={(e) => this.setState({ selected: e.target.value })} />
                    <label htmlFor="frequency">12 Month Membership - $80</label>
                    </div>

                </form>
        
              
                {this.state.selected === "3-month" &&
                    <>
                        <p>current total is $40</p>
                        <Checkout amount="4000"/>
                    </>
                }
                {this.state.selected === "6-month" &&
                    <>
                        <p>current total is $60</p>
                        <Checkout amount="6000"/>
                    </>
                }
                {this.state.selected === "12-month" &&
                    <>
                        <p>current total is $80</p>
                        <Checkout amount="8000"/>
                    </>
                }
             
              </div>
          )
        }

}

//     state = {
//       selected: 'radio-1'
//     };
//     componentDidUpdate () {
//       alert(document.querySelector('input[name=myRadio]:checked').value);
//     }
//     render () {
//       return (
//         <div>
//           <input type='radio' id='radio-1' name='myRadio' value='radio-1'
//             checked={this.state.selected === 'radio-1'} onChange={(e) => this.setState({ selected: e.target.value })} />
//           <br />
//           <input type='radio' id='radio-2' name='myRadio' value='radio-2' 
//             checked={this.state.selected === 'radio-2'} onChange={(e) => this.setState({ selected: e.target.value })} />
//         </div>
//       );
//     }
//   };
