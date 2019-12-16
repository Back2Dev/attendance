import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'
import CONSTANTS from '/imports/api/constants.js'

import { RegExId, createdAt, updatedAt } from '/imports/api/schema'

export const contact = new SimpleSchema({
  name: { type: String, label: 'contact name' },
  email: { type: String, label: 'contact email' }
})

export const headers = new SimpleSchema({
  'X-Mozilla-Status': { type: String, label: 'X-Mozilla-Status' },
  'X-Mozilla-Status2': { type: String, label: 'X-Mozilla-Status2' },
  'Return-Path': { type: String, label: 'Return-Path' },
  'Delivered-To': { type: String, label: 'Delivered-To' },
  Received: [String],
  'Return-path': { type: String, label: 'Return-path' },
  'Envelope-to': { type: String, label: 'Envelope-to' },
  'Delivery-date': { type: String, label: 'Delivery-date' },
  'DKIM-Signature': { type: String, label: 'DKIM-Signature' },
  'Content-Type': { type: String, label: 'Content-Type' },
  Date: { type: String, label: 'Date in headers' },
  From: { type: String, label: 'From in hearders' },
  'Mime-Version': { type: String, label: 'Mime-Version' },
  'Reply-To': { type: String, label: 'Reply-To' },
  Subject: { type: String, label: 'Subject in headers' },
  'Message-ID': { type: String, label: 'Message-ID' },
  To: { type: String, label: 'To in headers' },
  'Received-SPF': { type: String, label: 'Received-SPF' },
  'X-SPF-Result': { type: String, label: 'X-SPF-Result' },
  'Authentication-Results': { type: String, label: 'Authentication-Results' },
  'X-SpamExperts-Class': { type: String, label: 'X-SpamExperts-Class' },
  'X-SpamExperts-Evidence': { type: String, label: 'X-SpamExperts-Evidence' },
  'X-Recommended-Action': { type: String, label: 'X-Recommended-Action' },
  'X-Filter-ID': { type: String, label: 'X-Recommended-Action' },
  'X-Report-Abuse-To': { type: String, label: 'X-Report-Abuse-To' },
  'SG-Abuse': { type: String, label: 'X-Report-Abuse-To' }
})

const OrderEmails = new Mongo.Collection('orderemails')

export const OrderEmailsSchema = new SimpleSchema({
  _id: RegExId,
  date: { type: String, label: 'date' },
  subject: { type: String, label: 'subject' },
  from: contact,
  to: contact,
  headers: headers,
  text: { type: String, label: 'text in the email' },
  html: { type: String, label: 'html in the email' },
  status: { type: String, label: 'status' }
})

OrderEmails.attachSchema(OrderEmailsSchema)
export default OrderEmails
