import React from 'react'
import './pin'

const BuyMe = props => {
  const fields = HostedFields.create({
    /* Set this to true when testing. Set it to false in production. */
    sandbox: true,

    /*
      These are the CSS styles for the input elements inside the iframes. Inside each iframe
      is a single input with its id set to name, number, cvc or expiry.

      When the input has a valid value, it will have the 'hosted-fields-valid' class. When
      the input has an invalid value, it will have the 'hosted-fields-invalid' class.
    */
    styles: {
      'input': {
        'font-size': '16px',
        'font-family': 'helvetica, tahoma, calibri, sans-serif',
        'color': '#3a3a3a'
      },
      '.hosted-fields-invalid:not(:focus)': {
        'color': 'red'
      }
    },

    /*
      The fields object defines the fields to be created. All four fields are required
      (name, number, cvc, expiry).

      Each field requires a selector for the element in which to create an iframe. Optionally,
      you can define placeholder text and a label selector (the CSS selector of the label
      element for that particular field).
    */
    fields: {
      name: {
        selector: '#name',
        placeholder: 'Name on card'
      },
      number: {
        selector: '#number',
        placeholder: 'Credit card number'
      },
      cvc: {
        selector: '#cvc',
        placeholder: 'CVC (on back of card)'
      },
      expiry: {
        selector: '#expiry',
        placeholder: 'Card Expiry (MM/DD)'
      }
    }
  })

  /*
    Tokenises the hosted fields. Appends a hidden field for card_token on success, adds
    error messages otherwise.
  */

 function tokenizeHostedFields(){

  /*
    Tokenise the card. This requires address details not included in the hosted fields
    which can be pulled from elsewhere (such as other form elements).
  */
  fields.tokenize(
    {
      publishable_api_key: 'pk_g5_qP5N35CdS37gXDZK97g',
      address_line1: '71 Carter St',
      address_line2: '',
      address_city: 'Middle Park',
      address_postcode: '3206',
      address_state: 'VIC',
      address_country: 'Australia'
    },
    function(err, response){
      if(err) {
        /*
          Example error:

          {
            error: "invalid_resource",
            error_description: "One or more parameters were missing or invalid",
            messages: [
              {
                code: "number_invalid",
                message: "A valid card number is required",
                param: "number"
              }
            ]
          }
        */

        handleErrors(err);
        return;
      }


      /* Append a hidden element to the form with the card_token. */

      $('<input>').attr({
        type: 'hidden',
        id: 'card_token',
        name: 'card_token',
        value: response.token
      }).appendTo('#payment_form');

      /* Resubmit the form with the added card_token input. */
      $('#payment_form').submit();
    }
  );
}

/* Handles rendering of the error messages to the form. */

function handleErrors(err){
  /* Clear any existing error messages. */

  // $('.error_message').text('');

  /* Add each error message to their respective divs. */

  err.messages.forEach(function(errMsg){
    $('#errors_for_' + errMsg.param).text(errMsg.message);
  });
}

  const submitForm = () = {
    tokenizeHostedFields();
  }
  return (
    <form id="payment_form" action="/url_to_your_server_to_create_charge" method="post">
      <label for="name">Full name</label>
      <br />
      <div id="name" />
      <div id="errors_for_name" className="error_message" />

      <label for="number">Card number</label>
      <br />
      <div id="number" />
      <div id="errors_for_number" className="error_message" />

      <label for="cvc">CVC</label>
      <br />
      <div id="cvc" />
      <div id="errors_for_cvc" className="error_message" />

      <label for="expiry">Expiry</label>
      <br />
      <div id="expiry" />
      <div id="errors_for_expiry" className="error_message" />

      <input type="submit" onClick={submitForm}/>
    </form>
  )}

export default BuyMe
