import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import { Roles } from 'meteor/alanning:roles'

/* eslint-disable no-console */

const defaultAccounts = [
  {
    email: 'admin@back2bikes.com.au',
    password: 'me2',
    role: ['signin', 'paynow', 'servicing', 'parts', 'admin', 'superadmin']
  },
  {
    email: 'workshop@back2bikes.com.au',
    password: 'b2b525.24',
    role: ['signin', 'paynow', 'servicing', 'parts', 'admin', 'superadmin']
  },
  { email: 'info@peakadventure.com.au', password: 'changeme', role: ['signin', 'member', 'admin'] }
]

const defaultRoles = ['signin', 'paynow', 'servicing', 'parts', 'admin', 'superadmin', 'member']
defaultRoles.map(name => {
  if (!Meteor.roles.findOne({ _id: name })) {
    console.log(`Adding role ${name}`)
    Roles.createRole(name)
  }
})

function createUser(email, password, roles) {
  console.log(`  Creating user ${email}.`)
  const id = Accounts.createUser({
    username: email,
    email,
    password
  })
  if (roles.length > 0) {
    roles.forEach(role => {
      if (!Meteor.roles.findOne(role)) {
        console.log(`Adding role  ${role}`)
        Roles.createRole(role, { unlessExists: true })
      }
    })
    // Need _id of existing user record so this call must come after `Accounts.createUser`.
    Roles.addUsersToRoles(id, roles)
  }
}

/** When running app for first time, pass a    settings file to set up a default user account. */
if (Meteor.users.find().count() === 0) {
  if (defaultAccounts) {
    console.log('Creating the default user(s)')
    defaultAccounts.map(({ email, password, role }) => {
      console.log(`Adding ${email} [${role}] `)
      createUser(email, password, role)
    })
  } else {
    console.log('Cannot initialize the database!  Please invoke meteor with a settings file.')
  }
}
