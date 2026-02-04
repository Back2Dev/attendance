import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import { Roles } from 'meteor/alanning:roles'

/* eslint-disable no-console */

const defaultAccounts = [
  {
    email: 'admin@back2bikes.com.au',
    password: 'me2',
    role: ['signin', 'register', 'paynow', 'servicing', 'parts', 'admin', 'superadmin']
  },
  {
    email: 'workshop@back2bikes.com.au',
    password: 'b2b525.24',
    role: ['signin', 'register', 'paynow', 'servicing', 'parts', 'admin', 'superadmin']
  },
  {
    email: 'info@peakadventure.com.au', password: 'changeme',
    role: ['signin', 'register', 'member', 'admin']
  },
  { email: 'wookie@test.com', password: 'me2', role: ['member', 'shop'] }
]

const defaultRoles = ['signin', 'paynow', 'servicing', 'parts', 'admin', 'superadmin', 'member']

async function ensureRoles() {
  for (const name of defaultRoles) {
    if (!(await Meteor.roles.findOneAsync({ _id: name }))) {
      console.log(`Adding role ${name}`)
      await Roles.createRoleAsync(name)
    }
  }
}

async function createUser(email, password, roles) {
  // console.log(`  Creating user ${email}.`)
  const id = Accounts.createUser({
    username: email,
    email,
    password
  })
  if (roles.length > 0) {
    for (const role of roles) {
      if (!(await Meteor.roles.findOneAsync(role))) {
        // console.log(`Adding role  ${role}`)
        await Roles.createRoleAsync(role, { unlessExists: true })
      }
    }
    // Need _id of existing user record so this call must come after `Accounts.createUser`.
    await Roles.addUsersToRolesAsync(id, roles)
  }
}

/** When running app for first time, pass a settings file to set up a default user account. */
Meteor.startup(async () => {
  await ensureRoles()

  if ((await Meteor.users.find().countAsync()) === 0) {
    if (defaultAccounts) {
      console.log('Creating the default user(s)')
      for (const { email, password, role } of defaultAccounts) {
        console.log(`Adding ${email} [${role}] `)
        await createUser(email, password, role)
      }
    } else {
      console.log('Cannot initialize the database!  Please invoke meteor with a settings file.')
    }
  }
})
