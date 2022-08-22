/* global Roles */
const cc = require('change-case')
const debug = require('debug')('app::fixtures')

// Default config object - this gets overridden by the file /server/fixtures.js
Fixtures = {
  data: {},
  config: {
    things: [], // Regular fixtures
    boot: ['roles'], // Boot time loading, system won't work without these
    test: [], // Fixtures just for testing
    debug: false,
  },
}

Fixtures.loadAssets = function (items) {
  items.forEach(function (thing) {
    const jsonFile = `json/${thing}.json`
    try {
      Fixtures.data[thing] = JSON.parse(Assets.getText(jsonFile))
    } catch (e) {
      // Does it look like a plain text file?
      const names = Assets.getText(jsonFile).split(/\n/)
      if (names.length) {
        Fixtures.data[thing] = names.map((name) => {
          return { name }
        })
      } else console.error(`Error parsing JSON fixtures data file: ${jsonFile}\n  - error message is : '${e.message}'`)
    }
  })
}

Fixtures.loadUsers = function () {
  if (!Fixtures.config.defaultPassword) {
    Fixtures.config.defaultPassword = 'password'
  }
  if (!Fixtures.data.users) {
    console.error('No user fixtures found')
    return
  }
  Fixtures.data.users.forEach((user) => {
    var id
    try {
      if (!Meteor.users.findOne({ emails: { $elemMatch: { address: user.email } } })) {
        if (Fixtures.config.debug)
          console.log('Adding  user ' + user.email, user.username)

        //
        const builtins = ['email', 'username', 'password']
        let profile = {
          name: user.name ? user.name : user.username,
        }
        Object.keys(user).forEach((f) => {
          if (!builtins.includes(f)) profile[f] = user[f]
        })
        id = Accounts.createUser({
          email: user.email,
          password: user.password ? user.password : Fixtures.config.defaultPassword,
          username: user.username ? user.username : user.name,
          core: true,
        })
        if (user.roles) {
          Roles.setUserRoles(id, user.roles)
        }
      } else {
        if (Fixtures.config.debug) console.log('User exists ' + user.email, user.username)
      }
    } catch (e) {
      console.error('Error loading users: ' + e.message)
    }
  })
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Fixtures.loadBootThings = function () {
  Fixtures.loadThese('boot')
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Fixtures.loadThings = function (which) {
  Fixtures.loadThese('things', which)
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Fixtures.loadThese = function (list, which) {
  //
  // Work out what environment we are working in...
  //
  let env = 'unknown'
  if (!(Meteor.settings.env && Meteor.settings.env.environment))
    console.warn('No env.environment in your settings file, defaulting to ' + env)
  else env = Meteor.settings.env.environment

  if (Fixtures.config.debug) console.warn(`Fixtures: Loading ${list}`)
  Fixtures.config[list]
    .filter((thing) => (which ? thing.name === which : true))
    .forEach((thing) => {
      if (!thing.name || !thing.key || !thing.table)
        console.warn(
          'Thing is incomplete: ' +
            thing.name +
            ', it is missing one or more of name,key or table'
        )
      else {
        const collection =
          typeof thing.table === 'string'
            ? Mongo.Collection.get(thing.table)
            : thing.table
        // If the collection object doesn't exist here, it means that a `new Mongo.Collection('collection')` hasn't been done
        if (!collection)
          throw new Meteor.Error(
            `Collection ${thing.table} has not been created, aborting fixtures load`
          )
        if (thing.name === which) {
          if (thing.name.match(/\-test/i)) collection.remove({ [thing.key]: /^test/ })
          else collection.remove({})
        }
        //
        // If there is an environment filter on this table, see if it's needed
        //   for this environment
        //
        let doit = true
        if (thing.env) {
          let environs = []
          if (typeof thing.env === 'string')
            // Be nice and accept either a string or an array
            environs = [thing.env]
          else environs = thing.env // Assume it's an array
          if (!environs.includes('all') && !environs.includes(env)) doit = false
        }
        if (!doit) {
          console.log('Not loading ' + thing.name + ' in environment ' + env)
        } else {
          if (Fixtures.config.debug) console.warn(' Checking ' + thing.name)
          const rowData = Fixtures.data[thing.name] || []
          if (!rowData.length) console.warn(`No fixtures data found for ${thing.name}`)
          rowData.forEach((c) => {
            // Check if this record exists already
            let criteria = {}
            criteria[thing.key] = c[thing.key]
            if (collection.find(criteria).fetch().length === 0) {
              if (Fixtures.config.debug)
                console.log("  Adding '" + c[thing.key] + "' to " + thing.name)
              // Related tables look like this in the configs, where `Schools is the master, and Classes the detail...
              // {table: Classes,  name: 'classes',  data: 'classes',  key: 'name',
              //   related: {
              // table: Schools,
              // lookup: 'slug',
              // fk: 'schoolId',
              // reference: 'school_slug',
              //   }
              // },
              if (thing.related) {
                let criteria = {}
                criteria[thing.related.lookup] = c[thing.related.reference]
                let rec = thing.related.table.findOne(criteria)
                if (Fixtures.config.debug) console.log('Looking up fk', criteria, rec)
                if (rec) {
                  c[thing.related.fk] = rec._id
                }
              }
              //
              // User related tables will autocreate the users if they don't exist, or look up their ids
              //
              if (thing.user) {
                let urec = Meteor.users.findOne({
                  emails: { $elemMatch: { address: c.email } },
                })
                if (!urec) {
                  let uid = Accounts.createUser({
                    email: c.email,
                    password: c.password ? c.password : thing.user.defaultPass,
                    username: c.name,
                    profile: { name: c.name },
                  })
                  c[thing.user.id] = typeof thing.user.id === 'object' ? [uid] : uid
                } else {
                  if (Fixtures.config.debug)
                    console.log(thing.name + ' user exists: ' + c.name)
                  c[thing.user.id] =
                    typeof thing.user.id === 'object' ? [urec._id] : urec._id
                }
              }
              if (Fixtures.config.debug) debug(`Inserting ${c[thing.key]}`)
              try {
                collection.insert(c)
              } catch (e) {
                console.error(`Error loading fixture ${thing}: ${e.message}`)
              }
            } else {
              if (Fixtures.config.debug) console.log(" '" + c[thing.key] + "'  exists")
            }
          })
        }
      }
    })
  // Don't auto create users unless the db is empty
  // TODO: put these under config control (ie per selected environments only)
  if (Meteor.users.find().count() === 0) Fixtures.loadUsers()
}
