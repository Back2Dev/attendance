#!/usr/local/bin/node
// survey-parser.js
'use strict'
//
// Survey Parser utility - simple parser to extract the definitions from a survey file
//
var fs = require('fs')
var opts = require('minimist')(process.argv.slice(2))

const debug = require('debug')('inbox:parser')

const inboxfile = opts._[0] || "registrations/INBOX"
const outfile = opts._[1] || "registrations/volunteers.js"
//
// Modes are idle, header, volunteer, emergency, reasons
//
let mode = "idle"


const wanted = {
	volunteer: {
		From: "from",

		"Address": "address",
		"Address2":  "address2",
		"Suburb": "suburb",
		"State": "state",
		"Postcode": "postcode",

		"Phone": "phone",
		"Mobile": "mobile",

		"Work status": "workStatus",
		"Number of bikes": "bikes",
		"Primary bike": "primaryBike",

		"Reasons for volunteering": "volunteerReason",
	},
	emergency: {
		"Emergency": "emergencyContact",
		"Email": "emergencyEmail",
		"Phone": "emergencyPhone",
		"Mobile": "emergencyMobile",
	}

}


const inbox = [];

const saveLastEmail = function(buf) {
	debug("Adding ",buf)
	inbox.push(buf)
	email = {}
}

const newEmail = function(label) {
	debug("newEmail",label)
	// saveLastEmail()
	email = {}
	mode = "header"
}

const startReasons = function(reason) {
	email.reasons = reason
	mode = "reasons"
}

const startVolunteer = function() {
	mode = 'volunteer'
}

const startEmergency = function() {
	mode = 'emergency'
}

const endEmergency = function() {
	mode = 'volunteer'
}

const endReasons = function() {
	if (mode === 'reasons') {
		email.reasons = email.reasons.replace(/\n--$/,"")
		mode === 'idle'
		saveLastEmail(email)
	}
}

const extractDate = function(dateString) {
	email.date = dateString
}

const clean = function (s) {
	let newString = s.trim();
	newString = newString.replace(/^(0\d\d\d)(\d+)$/,`$1 $2`)
	newString = newString.replace(/^([1-9]\d\d\d)(\d+)$/,`$1 $2`)
	return newString
}

const triggers = {
	header: {
		regex: /^X-Mozilla-Status: 0001/,
		action: newEmail,
	},
	volunteer: {
		regex: /^To: admin@back2bikes.com.au/,
		action: startVolunteer,
	}, 
	emergency: {
		regex: /^Emergency contact/,
		action: startEmergency,
	},
	endemergency: {
		regex: /^----------------------------------/,
		action: endEmergency
	},
	reasons: {
		regex: /^Reasons for volunteering:\s*(.*)/,
		action: startReasons,
	},
	endreasons: {
		regex: /^This e-mail was sent from a contact form on Back2Bikes/,
		action: endReasons,
	},
	date: {
		regex: /^Delivery-date: \w+, (\w+ \w+ \w+)/,
		action: extractDate,
	},
}


const when = new Date()
let email = {
}

fs.readFile(inboxfile, 'utf8', (err, data) => {
	if (err) throw err

	const errs = []
	let mode = ''
	// console.log(data.toString('utf8'))
	const lines = data.split(/\n/)

// Iterate over the lines in the file
	lines.forEach((line,ix) => {
		let done = false
		var l = line.trim()
		// debug(`${(ix+1)}:`,l)
// Look for triggers:
		Object.keys(triggers).forEach(d => {
			const trigger = triggers[d]
			const match = l.match(trigger.regex)
			if (match) {
				mode = d
				// debug(`Mode=${mode}`,trigger)
				done = true
				if (trigger.action) {
					trigger.action(`${match[1]}`)
					debug("Called action method for "+`${match[1]}, mode=${mode}`)
				}
			}
		})		
		if (!done) {
			if (wanted[mode]) {
				Object.keys(wanted[mode]).forEach(key => {
					// debug("Looking for "+key)
					const match = l.match(new RegExp(`^${key}:\s*(.*)`,))
					if (match && match[1]) {
						done = true
						email[wanted[mode][key]] = clean(match[1])
					} 
				})
			}
		}
		if (!done) {
			if (mode === "reasons") {
				email.reasons = email.reasons + `\n${l}`
			}
		}
	})
	if (errs.length === 0)
		console.log("ok")
	else
		console.error(`Errors detected in file:${inboxfile}\n  ${errs.join("\n  ")}`)
	fs.writeFileSync(outfile,JSON.stringify(inbox,null,2)+';\n')
})

