import React, { useState } from 'react'
import Checkout from '../purchase/checkout';
import './products.css'

const Passes = props =>  {
    
    const [pass, setPass] = useState(0)

    const handlePassChange = (e) => {
        const passNumber = e.target.value
        setPass([passNumber])
    }

    const passCost = 500 / 100

    const total = passCost * pass

    return (
    <div className="product-content pass-container">
        <h4>Passes</h4>
        <p>Passes allow you to visit Back 2 Bikes and use our equipment</p>

        <p>Each pass costs ${passCost}</p>
        
        <form>
            <label>How many Passes would you like to purchase?</label>
            <select name="passes" id="passes" onChange={handlePassChange}>
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
        </form>

        <p>Your total is <strong>${total}</strong></p>

        <Checkout
            amount={total * 100}
            panelLabel={"Total amount"}
        />
    </div>
    )
}

export default Passes

        

