# Import parts orders

This document describes how we will import parts orders into the database

## Background

Every time we place an order with BPW, we receive an email, confirming the order. This contains a list of each item ordered, including quantity, part no and price.

## Database structure

The following collections are used:

- Parts
- Orders
- OrderEmails

## OrderEmails collection

Emails are imported into this collection, and parsed into their various parts, ie text/html/attachments, as well as information from the header, such as to/from/subject/date etc

## Parts collection

Parts are sourced from Bicycle Parts Wholesale - in a separate process

## Orders

Orders can either be created using the user interface, or by being imported as a part of this process. If an order is imported from an email, a reference to the OrderEmail record is kept in the record.

## Processing

This is the steps in the process:

1. Prepare test data and setup tests
1. Define schema for `OrderEmails` (and changes to `Orders`)
1. Extract emails from Thunderbird into OrderEmails
1. Parse each email, and create Orders

### Development strategy

We'll use a test driven development approach on this. We'll set up a sample email file, and use that to provide sufficient scenarios for us to write the code. As we make changes, the test code will run until we get it to pass all the tests, and also fail on the bad test cases.

### Step 1a - Extract emails from Thunderbird into OrderEmails

Thunderbird stores messages in a simple text file. Each message begins with a line containing `From` (with a trailing space)

```
From
Return-Path: <bounces+5343763-2f5f-mike=almsford.org@sendgrid.net>
Delivered-To: mikkel@almsford.org
Received: from siteground364.com
	by siteground364.com with LMTP id gGVxNfprgFyRIAAAK2tdqQ
	for <mikkel@almsford.org>; Wed, 06 Mar 2019 18:55:22 -0600
Return-path: <bounces+5343763-2f5f-mike=almsford.org@sendgrid.net>
Envelope-to: mike@almsford.org
Delivery-date: Wed, 06 Mar 2019 18:55:22 -0600
```

So we can split the file into individual messages quite easily.

### Step 1b - Parse the email

Use either https://www.npmjs.com/package/eml-format or https://nodemailer.com/extras/mailparser/ to parse the email into its component parts

### Step 1c - Save the email to the collection

If the record doesn't exist already, and has the correct subject,

- Save the parsed object to the `OrderEmails` collection

### Step 2a - Parse the text portion of the email

There are two versions of the email message, one in plain text, and the other in html, suitable for display with a browser.

We'll parse the text version, as it doesn't contain all the unnecessary html markup.

Here is an example of the text:

```
BACK TO BIKES - PORT MELBOURNE
Thank you for your order.
We appreciate your continued business.
The details of your order are below.
Best Regards
The Bicycle Parts Wholesale Team

------------------------------------------------------
Order Number: 31765
View Online: https://www.bicyclepartswholesale.com.au/account/order/31765
Date Ordered: Thursday 07 March, 2019
Telephone Number: 0416 988 516 Mark
Email Address: mike@almsford.org
Account Number: 2047

Products
------------------------------------------------------
1 x GEAR INNER WIRE - Stainless Steel, 1.2 x 2000mm, 100 Piece File Box (16=
71A) =3D $87.25
1 x Plastic End Cap For Gear, 4mm Dia, Black (Bottle of 150) (1726B) =3D $8=
.68
2 x TYRE  27 x 1.1/4 BLACK with WHITE WALL (4758) =3D $16.40
4 x LIGHTS - Front & Rear Combo Light Set, 1 LED Mini Lights, 2 Functions, =
Alloy Housing (7344) =3D $34.72
4 x LIGHT SET - Front & Rear USB Lights,  3 Function, Lithium USB-Rechargea=
ble, Six20 packaging (7341) =3D $69.64

------------------------------------------------------
Sub-Total: $216.69
Freight (Freight will be added to your invoice once we have picked and pack=
ed your order.): $0.00
GST: $21.67
Total: $238.36

Delivery Address
------------------------------------------------------
BACK TO BIKES - PORT MELBOURNE
 :
 :
 : (additional lines removed)

```

We need to extract the following information

- Order number (BPW order number)
- Date ordered
- Parts ordered
  - Qty
  - Part no
  - Price per item
  - Price
  - Description
- Sub-total
- GST
- Total
- Purchase order no (our PO number)

All of these items are mandatory (except PO no)

Consistency rules:

- sub-total must match sum of item prices
- must have at least one item

Update the status of the `OrderEmail` record accordingly

### Step 2b - look for Parts in collection

For each item in the order, find the corresponding part in the `Parts` collection. Use the `_id` as a reference for `partId`

If a part cannot be found, it should be created with a status of 'auto-created', and also add an item to the logs to record that it was created.

### Step 2c - insert into Orders collection

Once an order has been identified, and passed the consistency rules, it is ready for insertion into the `Orders` collection.

## Historical data

We have data going back several years. We'll import everything we have (as long as it is practical), as data storage is cheap, and the volume of data is not high.
