# DB Admin scripting

Databases need CRUD utilities, and hand coding custom pages for maintaining data is very expensive. The purpose of this document is to describe a mechanism for generating DB Admin pages as automatically as possible.

## Approach

On the assumption that the CRUD utilities will all conform to the same basic pattern, and that there are some very good React utilities to help us quickly craft a basic and usable UI. We may need to manually make edits down the track, but it should be possible to generate say 90% of what we need.

## Tools

- React
- Uniforms
- Simple Schema
- React Tabulator (or react-data-grid)
- Material UI
- MongoDB
- Meteor & publications
- Some clever scripting and templating

# Getting started

The first thing to do is create a json file giving us details of the collection. Let's do an example of a collection to be called `PersonalWidgets`. It's a simple JSON file like this:

File: personal-widgets.json

```json
{
  "description": [
    "    Personal Widgets are highly persoonalised",
    " and the description field here is not used, so this is a place",
    " where you can provide some documentation details"
  ],
  "collection": "PersonalWidgets",
  "fields": {
    "name": "String",
    "slug": "String",
    "description": "OptionalString",
    "status": {
      "allowedValues": ["ready", "open", "closed"],
      "defaultValue": "ready"
    }
  },
  "generate": "CRUD",
  "defaultObject": {
    "name": "Best widget",
    "description": "This is the best wdiget I own"
  },
  "fixtures": [
    {
      "name": "Best widget",
      "slug": "best-widget",
      "description": "This is the best widget I own"
    },
    {
      "name": "Favourite widget",
      "slug": "favourite-widget"
    }
  ]
}
```

Notes on the above JSON

The fields object is a Simple Schema definition, with the following differences:

- Types (eg String) have to be quoted, eg "String", because it's JSON, and doesn't support JS data types
- You don't need to declare `_id` - that is added automatically
- You don't need to add `createdAt` and `updatedAt` - these are added automatically

Let's assume that the `personal-widgets.json` file lives in the `db-schema` folder, and our meteor project lives in `admin-app`

```
node scripts/mkmodule.js db-schema/personal-widgets.json admin-app
```

This is the set of files that are generated

```
|____imports
| |____ui
| | |____admin
| | | |____personal-widgets
| | | | |____add.js
| | | | |____adder.js
| | | | |____edit.js
| | | | |____editor.js
| | | | |____index.js
| | | | |____config.js
| | | | |____list.js
| | | | |____lister.js
| | | | |____view.js
| | | | |____viewer.js
| |____test
| | |____factory.personal-widgets.js
| |____api
| | |____personal-widgets
| | | |____methods.js
| | | |____server
| | | | |____publications.js
| | | |____schema.js
| | | |____schema.test.js
|____packages
| |____fixtures
| | |____personal-widgets.json
```

### Plumbing the new files into the app

```
imports/startup/server/generated-pubs.js
imports/test/generated-factories.js
imports/ui/pages/admin.js
```

The heart of this lives in the `scripts` folder at the top level of the project

| File                 | Description                                                            |
| -------------------- | ---------------------------------------------------------------------- |
| scripts/mkmodule.js  | Primary script to template files                                       |
| module.templates     | Each file in this folder is used for <br /> templating                 |
| module.templating.js | Script to template `generated-xxx` files (eg generated-routes)         |
| modules.js           | A list of the modules used by the above script - maintain this by hand |

## Templates in `module.templates`

| File                   | Description                              |
| ---------------------- | ---------------------------------------- |
| imports/ui/admin/xxx   | UI files                                 |
| index.js               | index, contains sub-routes               |
| list.js                | list UI component                        |
| lister.js              | Meteor list container, subscriptions etc |
| add.js                 | Add new record component                 |
| adder.js               | Meteor add container, subscriptions etc  |
| config.js              | Config data - customise                  |
| edit-schema.js         | Schema for eduti                         |
| edit.js                | Edit UI component                        |
| editor.js              | Meteor list container, subscriptions etc |
| view.js                | View only UI component                   |
| viewer.js              | Meteor list container, subscriptions etc |
| imports/test/          | Factory/test file => factory.xxx.js      |
| factory.js             | Factory definition (for automated tests) |
| packages/fixtures/json | Fixtures files                           |
| fixtures.js            | Fixtures                                 |
| imports/api/xxx        | server methods/schema/pubs files         |
| methods.js             | Mongodb methods                          |
| methods.sql.js         | MYSQL methods (optional)                 |
| publications.js        | in server folder                         |
| schema.js              | Mongo schema                             |
| schema.test.js         | Mongo schema test                        |
| schema.sql.js          | MYSQL schema                             |
