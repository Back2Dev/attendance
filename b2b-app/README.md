# Back2bikes - New server and front end (combined)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

## Prerequisites

### Development O/S and hardware

A Mac is not essential, but the dev world is Mac-first, so it makes it easier

2nd choice is Linux (whatever flavour you like)

3rd choice is Windows, use WSL (Windows Subsystem for Linuc) or a VM running Linux

You need at least 16GB of RAM and an SSD, anything less will struggle to do the job.

### Meteor installation, git, mongodb

* Install Meteor here: https://www.meteor.com/install
* Git https://git-scm.com/downloads
* Node Version Manager https://github.com/nvm-sh/nvm (Recommended, set your default to `v14`)
* Mongodb local server (recommended) https://www.mongodb.com/try/download/community
  * If you don't want to run a local mongo, you can run `npm run debug-local`
* Github account and set up an ssh key


## Installation & Setup

1. Create a folder for your projects. Some people put projects in `~/Documents`, some use `~/dev`. I use `~/customer-name`.

```bash
# clone the admin-app repository
$ git clone git@github.com:Back2Dev/attendance.git  # Assumes you are using ssh

# navigate into `attendance/b2b-app` folder and run
cd attendance/b2b-app
meteor npm install
```

## Running the Server

```bash
# serve at localhost:3080
$ npm run debug
```

It may take a minute or two to finish setting up Meteor version to match the project and do a build. You should see some output like this:

```
> back2bikes-attendance@2.0.0 debug
> DEBUG=app:* MONGO_URL=mongodb://localhost/b2b meteor --port 4090 --exclude-archs web.cordova,web.browser.legacy --settings dev.settings.json --inspect

[[[[[ ~/back2bikes/attendance/b2b-app ]]]]]

=> Started proxy.
W20220925-11:46:02.326(10)? (STDERR) Debugger listening on ws://127.0.0.1:9229/f41002c6-c7de-4e10-be28-47bcc9bc34e9
W20220925-11:46:02.330(10)? (STDERR) For help, see: https://nodejs.org/en/docs/inspector
I20220925-11:46:11.680(10)? {"level":"info","message":"Winston is logging to console at level info"}
I20220925-11:46:11.680(10)? {"message":"Unable to find Loggly configuration in settings. Loggly is NOT running.","level":"warn"}
I20220925-11:46:11.680(10)? {"message":"Unable to find Sentry DSN. Sentry is NOT running.","level":"warn"}
I20220925-11:46:11.953(10)? {"message":"SMS Sending is false","level":"info"}
W20220925-11:46:11.956(10)? (STDERR) 2022-09-25T01:46:11.956Z app:messages:sms { cfgs: null }
W20220925-11:46:11.958(10)? (STDERR) 2022-09-25T01:46:11.958Z app:messages:email { cfgs: null }
W20220925-11:46:12.399(10)? (STDERR) Fixtures: Loading boot
W20220925-11:46:12.399(10)? (STDERR)  Checking roles
I20220925-11:46:12.400(10)?   Adding 'MEM' to roles
W20220925-11:46:12.400(10)? (STDERR) 2022-09-25T01:46:12.400Z app::fixtures Inserting MEM
I20220925-11:46:12.404(10)?   Adding 'ADM' to roles
W20220925-11:46:12.404(10)? (STDERR) 2022-09-25T01:46:12.404Z app::fixtures Inserting ADM
I20220925-11:46:12.405(10)?   Adding 'CUS' to roles
W20220925-11:46:12.406(10)? (STDERR) 2022-09-25T01:46:12.405Z app::fixtures Inserting CUS
I20220925-11:46:12.407(10)?   Adding 'COA' to roles
W20220925-11:46:12.407(10)? (STDERR) 2022-09-25T01:46:12.407Z app::fixtures Inserting COA
I20220925-11:46:12.408(10)?   Adding 'GRE' to roles
W20220925-11:46:12.408(10)? (STDERR) 2022-09-25T01:46:12.408Z app::fixtures Inserting GRE
I20220925-11:46:12.409(10)?   Adding 'MEC' to roles
W20220925-11:46:12.409(10)? (STDERR) 2022-09-25T01:46:12.409Z app::fixtures Inserting MEC
I20220925-11:46:12.415(10)? Adding  user super.mario@mario.com super.mario@mario.com
W20220925-11:46:12.532(10)? (STDERR) Error loading users: Role 'PM' does not exist.
I20220925-11:46:12.533(10)? Adding  user mike.king@mydomain.com.au mike.king@mydomain.com.au
I20220925-11:46:12.632(10)? Adding  user minh.nguyen@mydomain.com.au minh.nguyen@mydomain.com.au
I20220925-11:46:12.713(10)? Adding  user pat.carmel@mydomain.com.au pat.carmel@mydomain.com.au
I20220925-11:46:12.795(10)? Adding  user vernon.wiza@testa.rossa vernon.wiza@testa.rossa
I20220925-11:46:13.470(10)? Adding  user haleigh.baumbach@testa.rossa haleigh.baumbach@testa.rossa
I20220925-11:46:13.581(10)? Checking for settings...
W20220925-11:46:13.581(10)? (STDERR) Errors found in public section of settings.json
W20220925-11:46:13.581(10)? (STDERR)  [
W20220925-11:46:13.581(10)? (STDERR)   {
W20220925-11:46:13.581(10)? (STDERR)     name: 'S3_REGION',
W20220925-11:46:13.581(10)? (STDERR)     type: 'keyNotInSchema',
W20220925-11:46:13.581(10)? (STDERR)     value: 'ap-southeast-2'
W20220925-11:46:13.581(10)? (STDERR)   },
W20220925-11:46:13.581(10)? (STDERR)   { name: 'S3_IDENTITY_POOL_ID', type: 'keyNotInSchema', value: '' },
W20220925-11:46:13.581(10)? (STDERR)   { name: 'S3_BUCKET_NAME', type: 'keyNotInSchema', value: '' },
W20220925-11:46:13.581(10)? (STDERR)   { name: 'S3_PUBLIC_URL', type: 'required', value: undefined }
W20220925-11:46:13.581(10)? (STDERR) ]
=> Started your app.

=> App running at: http://localhost:4090/
```

Point your browser to http://localhost:4090/ and click the login link at top-right. Login as

```
mike.king@mydomain.com.au
me2
```

This account hss admin access.

Swith to admin at top right:

<img width="387" alt="image" src="https://user-images.githubusercontent.com/2467919/192124912-1819de48-4f3c-4904-ab49-250009b91043.png">

Now the hamburger menu on the left gives you access to the admin functions


