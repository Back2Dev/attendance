# Starter app

This is a Meteor/React/Material UI starter app

It's a good starting point to build an app from. Features are

- Login/Register (Provider setup required)
  - Google OAuth
  - Facebook OAuth
  - Email/password
- Menu system and role switcher
- Email and SMS message sending queue
- In-app notifications (simple)
- Views are responsive/mobile friendly
- Database admin pages
- User admin
- User profile page

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

## Prerequisites

- Meteor installation
- Git
- Computer with Solid State Drive (SSD), and at least 8GB of RAM (16+ preferred)
- MacOS or Linux will install and run with little friction
- Windows computers may be troublesome in the setup stage (after that it's ok), particularly with low RAM and an older physical hard drive. The Windows file system isn't very efficient, and npm stores _*many*_ files in the `node_modules` folder.

* Meteor: `npm install -g meteor`
* Git: https://git-scm.com/downloads

## Installation & Setup

1. Clone the repository

```bash
# clone the repository
$ git clone git@github.com:Back2bikes/attendance.git

## Running the Server

# navigate into `starter` folder and run
cd attendance/starter
meteor npm install
```

2. Run the app itself.

Meteor can be run with simply `meteor run`, but this starter app needs  
some environment settings in a settings file, `dev.settings.json`.

It also makes use of Meteor's integrated mongodb database server

```
npm run debug-local
```

You will be able to access the app at http://localhost:4080/

You can login as `mike.king@mydomain.com.au` and the password is very simple, using the word "me" (without the quotes), followed by the number "2", again without the quotes.

## Advanced setup

The above works fine, but over time when developing (and rebuilding many times), Meteor's
build cache needs to be reset, which you can do with the `meteor reset` command.

Unfortunately this also resets the mongo database, meaning you will lose whatever data you have in there. So to avoid that, you should set up a local database server. If you

- Mongodb: `brew install mongodb-community@4.4`

Meteor has it's own version of nodejs, it ensures that the correct version of npm and node are used for the Meteor release you are using. That's why you should prefix any `npm` commands with `meteor`, to allow it to use the right version of npm/node.

There are some npm packages that can be installed globally (-g) to make them available as shell commands. You will need superuser access for this, by using `sudo`,

e.g.

```
sudo npm install -g mup
```

## Node Version Manager

It is recommended to use Node Version Manager (NVM), which manages multiple versions of node, and allows you to switch with one command, and the big bonus is that it's done in user space, so `sudo` isn't necessary.

See https://github.com/nvm-sh/nvm for details on how to set it up
