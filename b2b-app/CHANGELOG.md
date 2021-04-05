# Changelog

## Next

- Add doctype, milestone flag to workflow steps
- Refresh workflow docs, fixtures
- Added "other-tests" to root of project
- Enable logging to db, audit trail
- Added ability to add people to listing by the persons page in next-steps
- Revert to Meteor 1.12
- Replace some bootstrap includes with MaterialUI
- Re-organise fixtures files
- Convert email & SMS hacks to use Material UI
- Fix up template for editing
- Added JSON field to autoform
- Reworking email and sms template storage
- Integrated webforms into next steps page
- Integrated signatures and pdf generating functionality
- Added function to shorten URL
- Added function for generating and uploading pdfs to s3
- Refactor roles
- Add task.skipall, workflow bot
- Remove deleted flag
- Add status to listing and profile
- Calculate progress from job, last step/next steps
- Add customer and conveyancer dashboards
- Added results cache for testing
- Fix signup and add invite customer
- Added edit page for properties
- Add message editor
- Update workflow msg refs
- Added test script to view the property details while role is a customer
- PM property page
- Added PM dashboard
- Forgot password
- Simplify cdc form
- Added logger methods to backend methods
- Added folders and test list to determine the number tests that have been made and how many are working
- Add edit listing in next-steps
- Allow conveyancer to launch a job
- Added MessageTemplate and Workflow notification editing link
- Added partner admin and director roles
- Added livechat
- Fix surveys and pre-population
- Remove unused alert libs
- Fix GST calc
- Added webhooks for voi

## 2.6.11

### Hot fixes

- Hot fix for broken resume
- Allow docx and doc to be uploaded by default (browser check only) for conveyancer applications
- Missing signatures on webforms pdf

### Other changes

- Update SMS definitions in workflows
- Add search option in SMS/Email hacks
- Add Next steps page to listing viewer
- Store original filename and file extension in s3 for conveyancer applications
- Add AWS tests
- Add Avatar upload
- Added templates folder for buyers questionnnaire templates so it be signed in signnow
- Added changes to roles and added permissions for admin menu
- Integrated VOI into platform.
- Add progress chart
- Added test script for next steps components
- Add Sentry and loggly
- Added method for extracting user details to new internal database
- Add Sentry and loggly
- Added function to encrypt and decrypt data
- Add collections for webforms,surveys
- Improve generated listing layout
- Hot fix for broken resume
- Added pdf viewer to review step
- Hack for start job
- Added message templates into database for notifications
- Add preview document
- Fix workflow editor message ID rendering
- Add ability to cancel the listing

## 2.6.1

- Enable conveyancer to invite users and add properties

## 2.6.0

- Hot fix for emails

## 2.0.10

- Moved legacy admin functions to /imports/api/legacy and /imports/ui/legacy
- Fixed tests
- Legacy property listing and view/edit
- New property listing

## 2.0.9

- Fix file upload limit
- New listing email wasn't sent
- Add legacy edit roles page
- Added new menu items
- Added workflow editor features
- Fix conveyancer name in report pivot

## 2.0.9

- Fix file upload limit
- New listing email wasn't sent
- Add legacy edit roles page
- Added new menu items

## 2.0.8

- Don't remove old generated documents
- Check email templates for merge fields
- Fix SMS Send
- Refactored Email sending
- Add "edit" page to Listing Imports (CodeJar JSON editor)
- Add "edit' page to Conveyancers (Uniforms component)
- UI framework changes - will change the way code is generated
- Export email templates from Mandrill into our code (/imports/api/email-templates)
- Script to deploy email templates to Mandrill\* Export email templates from Mandrill into our code (/imports/api/email-templates)
- Bring in protected routes, so that we can add security to the app.
- Throws out the last vestiges of Redux
- Fixed some bugs with form submission that was causing full page reloads
- Add ids to most of components to front-end for automatic testing
- Add an admin page to send emails at will. Enter details and click send
- Some refactoring of agentbox code
- Fixed the alert styling (was broken)
- Made Account's Sale step in selling workflow as an optioanl requirement to move to next stage.
- Fixed up document generation and s3 upload to include better error handling.
- Added query to update settlement date to fix issue with properties settling within 14 days not appearing in dashboard
- Replaced sidebar
- Add SMS preview/sender page
- Add HACKS menu
- Switch mysql connection to pooled approach

## 2.0.7

- Add ability to edit navigation items
- Add webhooks (part 1)
- Fix boot time database updates handling to use ORM
- Remove use of sequelize
- Improve agentbox importing and processing

## 1.0.5

- Generated admin pages
- Cloned from man-x project
