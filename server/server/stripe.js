// const mongoose = require('mongoose')
// const expressGraphQL = require('express-graphql')
// const CORS = require('micro-cors')()

// const models = require('./models')
// const schema = require('./schema/schema')

// const attend = require('./models/attend-history')
// const person = require('./models/person')
// const transaction = require('./models/transaction')

// require('dotenv').config();
// /**
// |--------------------------------------------------
// | Create a new Subscription
// |--------------------------------------------------
// */


// // const express = require('express');
// // const router = express.Router();
// const User = require('../../models/User.model');

// const stripe = require("stripe")(process.env.STRIPE_SECRET) 

// router.post('/api/stripe', (req, res, next) => {
//     const { token, email, selectedOption } = req.body
//     // console.log(`10 - payment.controller - making the initial payment ${req.body}`)
 
//     stripe.customers.create({
// 	    email: email,
// 	    source: token.id,
//     }, ((err, customer) => {
//             User.findOne({email})
//                 .then( user => {
//                     user.stripeId = customer.id;
//                     user.paymentSource = customer.sources.data[0]
//                     // console.log(`20 - payment.controller ${customer.sources.data[0].card.last4}`) 
//                     return user.save();
//                 })
//                 .catch( err => 
//                     console.log(err))
        
//                     if (err) {
//                             res.send({
//                                 success: false,
//                                 message: err
//                             })
//                     } else if (selectedOption === "monthlyFrequency") {
//                             const { id } = customer
//                             stripe.subscriptions.create({
//                                 customer: id, 
//                                 items: [
//                                     {
//                                         plan: `${process.env.MONTHLY_PLAN}`,
//                                     },
//                                 ],
//                             }, function(err, subscription) {

//                                 if (err) { 
//                                     res.send({
//                                         success: false,
//                                         message: 'Error'
//                                     })
//                                 }
//                                 User.findOne({email})
//                                     .then( user => {
//                                         user.subscriptionId = subscription.id
//                                         user.save()
//                                         .then((response) => {
//                                             return res.send({
//                                                 success: true,
//                                                 message: 'Success'
//                                             })
//                                         }).catch((err) => {
//                                             console.log(err + "you got errors!")
//                                         });
//                                     })
//                         })
//                     }
//                     else if (selectedOption === "quarterlyFrequency") {
//                             const { id } = customer
                            
//                             stripe.subscriptions.create({
//                                 customer: id, 
//                                 items: [
//                                     {
//                                         plan: `${process.env.QUARTERLY_PLAN}`,
//                                     },
//                                 ],
//                             }, function(err, subscription) {
//                                 if (err) { 
//                                    return res.send({
//                                         success: false,
//                                         message: 'Error'
//                                     })
//                                 }

//                                 User.findOne({email})
//                                     .then( user => {
//                                 user.subscriptionId = subscription.id
//                                         user.save()
//                                         .then((response) => {
//                                             return res.send({
//                                                 success: true,
//                                                 message: 'Success'
//                                             })
//                                         }).catch((err) => {
//                                             console.log(err + "you got errors!")
//                                         });
//                                     })
                                
//                         })
//                     } else if (selectedOption === "sixMonthlyFrequency") {
//                         const { id } = customer
//                         stripe.subscriptions.create({
//                             customer: id, 
//                             items: [
//                                 {
//                                     plan: `${process.env.MONTHLY_PLAN}`,
//                                 },
//                             ],
//                         }, function(err, subscription) {

//                             if (err) { 
//                                 res.send({
//                                     success: false,
//                                     message: 'Error'
//                                 })
//                             }
//                             User.findOne({email})
//                                 .then( user => {
//                                     user.subscriptionId = subscription.id
//                                     user.save()
//                                     .then((response) => {
//                                         return res.send({
//                                             success: true,
//                                             message: 'Success'
//                                         })
//                                     }).catch((err) => {
//                                         console.log(err + "you got errors!")
//                                     });
//                                 })
//                     })
//                 }
                
//         })
//     )}
// )



// /**
// |--------------------------------------------------
// | Create a variable session purchase
// |--------------------------------------------------
// */

// /**
// |--------------------------------------------------
// | Create a workshop payment 
// |--------------------------------------------------
// */