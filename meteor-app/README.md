
[![Build Status](https://travis-ci.org/Back2bikes/attendance.svg?branch=master)](https://travis-ci.org/Back2bikes/attendance) [![Coverage Status](https://coveralls.io/repos/github/Back2bikes/attendance/badge.svg?branch=master)](https://coveralls.io/github/Back2bikes/attendance?branch=master) ![GitHub repo size](https://img.shields.io/github/repo-size/Back2bikes/attendance) ![Packagist](https://img.shields.io/packagist/l/Back2bikes/attendance?style=flat-square) ![GitHub last commit](https://img.shields.io/github/last-commit/Back2bikes/attendance)


## Contents
- [Mission Statement](#Mission_Statement)
- [Getting Started/ installation](#Getting_Started)
- [App Design](#App_Design)
- [Styling](#Styling)
- [Database](#Database)
- [Schemas](#Schemas)
- [Information on how the App uses Meteor](#how_the_App_uses_Meteor)
- [Working With Children Checks](#Working_With_Children_Checks)
---

# Attendance App
### Mission_Statement

As we have grown, we have realised the need to keep records, especially for insurance reasons.

We want to *Log attendance*

This app provides a really easy way for volunteers to sign in, and this helps us to track who has come, recognise our regulars, and reach out to people who stop coming.

### Getting_Started

1. Install Meteor here: [https://www.meteor.com/install](https://www.meteor.com/install)

2. Run the following commands:

`git clone https://github.com/Back2bikes/attendance.git`

`cd attendance/meteor-app`
`meteor npm install`

*_This next command can take a while the first time_*
`meteor run`

**What is Meteor?**
Meteor is a JS based framework similar to the *_[MERN](https://www.freecodecamp.org/news/learn-the-mern-stack-tutorial/) / [MEAN](https://www.youtube.com/watch?v=fhRdqbEXp9Y)_* stacks.

Meteor uses Javascript for coding the front, back and server. 

What seperates it from these stacks is that Meteor is run as a single product designed to ensure all parts work together.


  *_It takes functionality that you would ordinarily need to code and 'Magics ' it into the App from the start._*
 
[Documentation & Guide](https://guide.meteor.com/)  |  [Tutorial](https://www.meteor.com/tutorials/blaze/creating-an-app)  |  [Atmosphere, the Meteor Package Manager](https://atmospherejs.com/)

[Information on how the App uses Meteor](#Information on how the App uses Meteor)
 
### App_Design
 Meteor Apps are run off the [MVC design pattern](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) and seperate where data can flow.
 
 **Components**
 Re-usable Components are found within `/meteor-app/imports/ui/components`
 
 All other pages/ components are page specific within their own folder in: `/meteor-app/imports/ui/`.

The app consists of 8 high-level components. They are:

1 . Display-user component
2 . Admin Panel component
3 . Service Selector Component
4 . Bike assessment component
5 . Bike assessment review component
6 . Customer details component
7 . Confirmation component
8 . Current bike jobs component

---
 << THE ABOVE MAY NOT BE CORRECT ANY MORE >>
 ---
 
### Styling
 The Attendance App is using [Semantic UI](https://atmospherejs.com/semantic) for styling. 
 
 This package is automatically synced with the Semantic UI repo.
 
 [Learn Sematic](http://learnsemantic.com/)  |  [Official Repository](https://github.com/Semantic-Org/Semantic-UI)  |  [Semantic-UI Homepage](https://semantic-ui.com/)
 
 Each folder possesses it's own semantic.min.css file

### Database
Meteor integrates with MongoDB and creates a mini MongoDB that lives on the client side within their session.

Any requests/ updates from them will impact on their session database only.

By providing a seperate DB to the user we limit any pull/push requests and ensure a seamless use of the website.

Updates to the actual database will performed without impacting on website load times/ UX.

[MongoDB Docs](https://docs.mongodb.com/)  |  [Tutorials](https://docs.mongodb.com/manual/tutorial/)


**Dummy data** *_for development only_*
 The script to populate the app with dummy data is in `meteor-app/imports/startup/server/members-data.js`
 
To reset the data to the initial state run: `meteor reset`

When you next run `meteor run` the startup script will repopulate the DB.

> Remember to update this file when you update/ change data fields  that a user will need.


### Schemas

Some shared controller/methods for schema calls can be found here: `/imports/api/schema.js`

**Member records** :`/imports/api/members/` 

**Session records** : `/imports/api/sessions/`
An individual session record will be created for user interactions.

**Bike assessments/ Jobs** : `/imports/api/assessments/` 



### how_the_App_uses_Meteor

Meteor controls how data is accessed 'under the hood' through it's functions:
- `Meteor.publish`
and 
- `Meteor.subscribe`

By default, all of the data inside a Meteor project’s database is available to that entire project. 

If you publish data, you can *_subscribe_* to that data in any file.
*_This is similar to a Redux Store._*

>This is convenient during development, but it’s a security issue that must be addressed in the code before launching the application.

>More information on this can be found under [autopublish](https://www.meteor.com/tutorials/blaze/publish-and-subscribe)

After you initialize a new Mongo Collection
i.e. `const Members = new Mongo.Collection('members')`
you can do the below to share it across the App.
```
Meteor.publish('all.members', () => {
  return Members.find({});
});
```

### Testing
Tests are performed through a combination of JEST and [Cypress](https://www.cypress.io/)

begin tests by cd'ing into the `attendance/meteor-app` folder and running:
`meteor npm run debug.b2b`

---
<< Check on this part re: tests to run. There are too many scripts and many seem broken >>
---

#### Working_With_Children_Checks
All files to do with this can be found here:  `/imports/api/wwccs`
including the Schema & Methods with Axios integration

[Working With Children Checks - Application Process](https://www.workingwithchildren.vic.gov.au/individuals/applicants/how-to-apply)  |  [Check Status Online](https://online.justice.vic.gov.au/wwccu/checkstatus.doj#_ga=2.142958133.1872289877.1582606042-353645631.1582606042)
