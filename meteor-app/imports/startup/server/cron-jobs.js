// cron-jobs.js
import { Meteor } from 'meteor/meteor'
import moment from 'moment'
import { _ } from 'lodash'
const cron = require('node-cron')
const debug = require('debug')('b2b:cron')

import log from '/imports/lib/log'
import Members from '/imports/api/members/members'

// import { CRON_JOBS, INTERCOM } from './server-constants'


let busy = 0

Meteor.methods({

})

const signoutTicker = () => {
	const hour = moment().hour()
	debug("Tick "+hour)
	if (hour >= 21) {
		try {
			const n = Members.update({
				isHere: true,
			}, {
				$set: { isHere: false },
			},{
				multi: true,
			})
			debug(`Signed out ${n} members`)
		} catch(error) {
			console.error(`Error ${error.message} encountered signing members out`)
		}
	}
}

Meteor.startup(function() {
    cron.schedule(
  		'1 * * * *',
      Meteor.bindEnvironment(signoutTicker)
    )
})