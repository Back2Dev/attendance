# Logging and Audit trail

This document describes the logging

Import the logger

```
import logger from '/imports/lib/log'
```

This logger is isoorphic, i.e. it can be called from either client code or server code.

## Client logging

On the client, there isn't much point in logging, it just gets sent to the browser console, like `console.log()`

## Server logging

Use is made of Winston transports. Any log calls are sent to

- Loggly ( a log analysis service ) (turn on with`Meteor.settings.loggly` {token, subdomain}) DO NOT USE IN DEV
- Server console
- Database (turn on with `Meteor.settings.log2b` see note on MONGODB transport)

How to log things:

The logger object supports verbs:

- info()
- warn()
- error()
- debug()

Examples:

```
  logger.info('This is for information only','A String')
  logger.warn('This is a warning for you',999)
  logger.error('Something is broken!',[99,'CCC'])
  logger.info('This is for debugging',{a:1,b:2})
```

Where the second parameter is any type of data or object, and is stored in the collection for future reference.

### Automatic clean-up

The `logs` collection is configured as a capped collection, which is limited to contain a maximum number of 100,000 records, after which old records are deleted as new entries are created.

Also supported is a `.audit()` method, the purpose of which is to record a significant event to the audit trail (the `audits` collection) _as well as the log collection_. This collection will be kept long term.

Usage is similar, the first parameter is a string with a description, and the second is a simple type, array or object, and is stored in the collection for future reference.

```
  logger.audit('This is an audit trail event',optional-data)
```

## Known problem with WINSTON-MONGODB transport

The winston-mongodb transport doesn't handle metadata easily, it needs to be passed
inside an object `{meta: }` - this is a breaking change, which means logging to the local db
is impractical. Forking that module might be an option, but it's not critical for us,
so we'll leave the code here but not use it. Loggly will suffice.

Story here: https://github.com/winstonjs/winston-mongodb/issues/150
