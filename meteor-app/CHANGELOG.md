# Changelog

## Next

- B2B generic info and actionemail templates
- Send receipt email
- Import charges from pinpayments
- Added view of charges with 'refresh' button
- Add reconciliation to charges and carts, improved layouts
- Add admin button to edit user details
- Add b2b member portal
- Fix coding problems with certain test scripts
- Add new service test scripts for input and UI
- Refactor factories code
- Added member.paymentEmails array
- Fix email to be lower case
- Remove settings symlinks, adjust package.json
- Fix the event import


## 1.2.4

- Strip out unused lines from top of slsa file
- PA shop testing - write fixtures when sending invites
- Meteor 1.8.3 update
- Mocking up the pinpayment interface.
- Added already-paid page.
- Numerous bug fixes to do with the shopping cart handling.
- Added some tests.
- Non-meteor context handling
- Get storybook to work again
- Restore snapshots
- Had to remove storybook specs
- Added WWCC check
- Added functionality which displays an error when the number isn't similar to actual WWCC number
- Added functionality checking whether volunteer has a working with childrens check number
- Improved deployment logging
- Added functionality for members to edit their details.
- User accounts are created on sign up for accessing member's portal.
- Added initial version of member's portal.
- Added route for existing members to sign up for an account to access portal.
- Reworked member's sign up form to include password field.
- Added ability for existing members to request PIN number on sign up page

## 1.1.14

- fixed updatedAt definition
- removed autoPay test (doesn't work in CI environment)

- Added new collections for sales
- Upgrade cypress to 3.1.5
- Added shopping cart
- Improved set pin handling
- Auto submit when new pin matches
- Bring modal up for ipad use
- iPad support
- PIN entry - auto-tab to next field after 4 digits
- Limited PIN entry to 4
- Added mup logging
- Checkin lists available events
- Fixed cron problem
- Added Membership Card
- Added Multi-visit Card and Maintain-Course Card.
- Show expired members in red
- Added image scraper
- Fixed query for 'once' events (date range was broken)
- Added attendance page in admin menus

## 0.11.0

- Made it configurable for PA use, put all menu items across the top

## 0.10.0

- Added special PIN = '----', meaning "I don't want a PIN Number"
- Added supervisor PIN override '1--1'
- Added more avatars
- Added version number template

## 0.8.0

- Fixed instant auto-logout

## 0.4.0

- Added Cypress integration
- Added SMS send method
- Added eventLog() method and Eventlogs collection
- Upgraded to npm version of simple-schema and updated collection2 to 3.0
- Added createdAt and updatedAt schema shortcuts
- Added Order Schema and test
- Added Part Schema tests
- Added Parts schema, publication
- Seeded dummy Parts data
- Added ordering layout and ordering component
- Added Navbar for Parts assesment and Bike Servicing
- Added /ordering/cart route
- Order subscription and publication
- Added Assessment, ServiceItems and Services schema
- Added Assessment publication
- Add Assessment, ServiceItems and Services schema tests
- Add seed data for services and service items/parts
- Add assessment form submission functionality
- Add To Cart feature (adds a part to current order, otherwise it updates the parts quantity)
- Add parts searchbar
- Add job cart update status and print job functionality
- Add search functionality for job cart
- Upload interface added to /admin
- Add status filter for job cart
- Add live price update for form
- Add a name search feature to the search functionality
- Fix storybook missing runtimeGenerator problem
- Added jobNo to assessment, show in list
- Renamed Assessment collection to be plural (as per convention), => Assessments
- Changed customer name to show "Refurb" instead of Back2bikes
- Shrink job listing layout
- Added Cypress end-2-end testing, streamlined CI script to use npm ci
- Set PIN doesn't ask for PIN again
- Add storybook entry for set PIN

## 0.3.0

- Upgraded to proper semantic-ui markup
- Added storybook and storyshots
- Renamed files for naming conventions
- Added test suite
- Meteor 1.6.0.1 upgrade
- Moved member data to a private repo (b2b-private)
- Added in knobs, specs etc to Storybook
- Added story for add member
- Added force-ssl package
- Import members from json and save rejects with reason for rejection
