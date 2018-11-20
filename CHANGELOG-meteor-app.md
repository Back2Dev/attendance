# Changelog

Next 
------


0.4.0
------
* Added Cypress integration
* Added SMS send method
* Added eventLog() method and Events collection
* Upgraded to npm version of simple-schema and updated collection2 to 3.0
* Added createdAt and updatedAt schema shortcuts
* Added Order Schema and test
* Added Part Schema tests
* Added Parts schema, publication
* Seeded dummy Parts data
* Added ordering layout and ordering component
* Added Navbar for Parts assesment and Bike Servicing 
* Added /ordering/cart route 
* Order subscription and publication
* Added Assessment, ServiceItems and Services schema
* Added Assessment publication
* Add Assessment, ServiceItems and Services schema tests
* Add seed data for services and service items/parts
* Add assessment form submission functionality
* Add To Cart feature (adds a part to current order, otherwise it updates the parts quantity)
* Add parts searchbar
* Add job cart update status and print job functionality
* Add search functionality for job cart
* Upload interface added to /admin
* Add status filter for job cart
* Add live price update for form
* Add a name search feature to the search functionality
* Fix storybook missing runtimeGenerator problem
* Added jobNo to assessment, show in list
* Renamed Assessment collection to be plural (as per convention), => Assessments
* Changed customer name to show "Refurb" instead of Back2bikes
* Shrink job listing layout
* Added Cypress end-2-end testing, streamlined CI script to use npm ci
* Set PIN doesn't ask for PIN again
* Add storybook entry for set PIN


0.3.0
------
* Upgraded to proper semantic-ui markup
* Added storybook and storyshots
* Renamed files for naming conventions
* Added test suite
* Meteor 1.6.0.1 upgrade
* Moved member data to a private repo (b2b-private)
* Added in knobs, specs etc to Storybook
* Added story for add member
* Added force-ssl package
* Import members from json and save rejects with reason for rejection

