# Fixtures package

Author: Mike King

## Purpose

To load fixed data into the database at startup time, usually for debugging purposes, but can include app config data as well.

The code in this package loads data into a global variable called Fixtures

There is a companion server script, usually called server/fixtures.js,
whose responsibility it is to check if the data exists in the database and insert if it isn't there.

There are 2 classes of fixtures:

- Boot fixtures, which are automatically loaded at startup
- Regular fixtures, loaded on request only

### Adding a new fixture

Assuming you have created the collection already, using `scripts/mkmodule.js` (Don't forget to generate module routes etc with `scripts/module.templating.js`)

let's call it 'widgets' for this example:

`packages/fixtures/json/widgets.json` is an array of objects, each one being a record
`packages/fixtures/package.js` - Edit this file

```
const EXTRA_THINGS = ['field-maps', 'source-systems', 'workflows', 'roles', 'practices']
```

becomes

```
const EXTRA_THINGS = ['field-maps', 'source-systems', 'workflows', 'roles', 'practices', 'widgets']
```

Edit `server/fixtures-things.json` and append another item to the array, eg:

```
  {
    "table": "widgets",
    "name": "widgets",
    "key": "name",
    "env": [
      "all"
    ]
  }
```

The line: `"key": "name",` is used to denote the primary identifier, which is likely to be unique. So if your `widget` is identified by `widgetName` it would become `"key": "widgetName",`

and the last step is to load your new fixtures:

`Meteor.call("loadFixtures","widgets")`

### Reloading

If you want to replace the existing data, you can re-load any individual collection by
specifying the collection as a second parameter, eg:

`Meteor.call("loadFixtures","workflows")`

This will simply remove ALL records, and then run the fixtures
