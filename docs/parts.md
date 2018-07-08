# Parts app

We buy all our parts from one supplier, Bicycle Parts Wholesale and they do not provide RRP (Recommended Retail Price) to us.
At present we can't hide the trade price from the customer when looking at their web site. 

http://www.bicyclepartswholesale.com.au/page/10/product-catalogues

Their site looks like a regular shopping cart site. We don't need to build a shopping cart, but this might be interesting to look at briefly https://github.com/reactioncommerce/reaction

Bicycle Parts Wholesale (BPW) publish a glossy colour catalogue, which is essential when placing orders, as the photos on the web site and the descriptions are not always adequate to work out which part to order.

We have a CSV file of their database. It is simply a list of a part number, a short description and a bar code number. No category or sub-category information is available.

So we need to do the following:

* Import the parts list and prices to our (Mongo) database
* Provide a simple page (within our existing Meteor app) to allow searching of the database, either by name or part no
* Write an algorithm to calculate a RRP
* Display the price of the part(s) found as a list
* Provide an advanced search option

### Possible extension: 

* Allow part to be added to a draft order, with a quantity
* Review draft order, add/remove parts
* Send order to supplier (via email)
* BPW will send us updates the price list every now and then. An update process should allow an import of the new CSV file, but it should be checked to make sure that 1) The number of items should be +/- 10%, average prices should also be +/- 10%

All to be done using React, Storybook, TDD

## Pricing algorithm

* The first calculation is to double the wholesale price to make RRP. 
* This helps to cover GST and shipping costs.
* For more expensive items, we don't need to make so much, so for anything costing over $60, we mark it up by 50%
* Anything over $100 wholesale we mark it up by 30%
