#!/usr/local/bin/node
// survey-parser.js
'use strict'
//
// Survey Parser utility - simple parser to extract the definitions from a survey file
//
var fs = require('fs')
var opts = require('minimist')(process.argv.slice(2))

const debug = require('debug')('survey:parser')

const surveyfile = opts._[0] || "docs/sample-survey.txt"
const outfile = opts._[1] || "docs/sample-survey.js"

const newSection = function(title) {
	debug("newSection",title)
	if (survey.current.six === -1) {
		survey.current.six = 0
	} else {
		survey.current.six = survey.current.six + 1
	}
	if (!survey.sections[survey.current.six]) {
		survey.sections.push({ title, questions: [], objectType: "section" })
	}
	section = survey.sections[survey.current.six]
	survey.current.object = section
	survey.current.section = section
}

const newList = function(title) {
	debug("newList",title)
	if (survey.current.lix === -1) {
		survey.current.lix = 0
	} else {
		survey.current.lix = survey.current.lix + 1
	}
	if (!survey.lists[survey.current.lix]) {
		survey.lists.push({ title, attributes: [], objectType: "list" })
	}
	const list = survey.lists[survey.current.lix]
	survey.current.object = list
	survey.current.q = list
}

const newQuestion = function(label) {
	debug("newQuestion",label)
	if (!section) {
		newSection("Default Section")
	}
	const q = { label, objectType: "question", attributes: [] }
	survey.current.object = q
	survey.current.q = q
	section.questions.push(q)
}

const newAttribute = function(title) {
	debug("newAttribute",title)
	if (!['question','list'].includes(survey.current.q.objectType)) {
		console.error(`Error: found an attribute [${title}] before a question`,survey.current.q)
	} else {
		const a = { title, objectType: "attribute" }
		survey.current.q.attributes.push(a)
		survey.current.object = a
		survey.current.a = a
	}
}

const addModifier = function(key,value) {
	survey.current.object[key] = value
}
 
const directives = {
	list: {
		regex: /^list:\s*(.*)/i,
		action: newList,
	},
	section: {
		regex: /^section:\s*(.*)/i,
		action: newSection,
	},
	question: {
		regex: /^q\s+(.*)/i,
		action: newQuestion,
	},
	attribute: {
		regex: /^a\s+(.*)/i,
		action: newAttribute,
	},
}

const modifiers = {
	survey: {

	},
	section: {
		flow: 1,
		info: 1,
	},
	question: {
		prompt: 1,
		label: 1,
		if: 1,
		type: 1,
		placeholder: 1,
		minwords: 1,
		multi:1,
		match: 1,
	},
	attribute: {
		value: 1,
	}
}

const when = new Date()
const survey = {
	sections:[],
	lists: [],
	current: {six: -1, lix: -1},
	info: {
		surveyfile, outfile, when
	}
}
let section

fs.readFile(surveyfile, 'utf8', (err, data) => {
	if (err) throw err

	const errs = []
	let mode = ''
	// console.log(data.toString('utf8'))
	const lines = data.split(/\n/)

// Iterate over the lines in the file
	lines.forEach((line,ix) => {
		let done = false
		var l = line.trim()
		debug(l)
// Look for directives:
		Object.keys(directives).forEach(d => {
			const directive = directives[d]
			const match = l.match(directive.regex)
			if (match) {
				mode = d
				debug(`Mode=${mode}`,directive)
				done = true
				if (directive.action) {
					debug("Calling action method for "+`${match[1]}`)
					directive.action(`${match[1]}`)
				}
			}
		})		
		if (!done) {
      let matches = l.match(/^\+(\w+)=(.*)/i)
      if (matches) {
      	if (!matches[2])
      		errs.push(`${surveyfile}:${(ix+1)}: Missing modifier value at (+${matches[1]}=)`)
				debug(`  modifier: ${matches[1]} = ${matches[2]}`)
				const key = matches[1].toLowerCase()
				const value = matches[2]
				if (!modifiers[mode][key]) {
					errs.push(`${surveyfile}:${(ix+1)}: Unexpected ${mode} modifier [${l}]`)
				} else {
					addModifier(matches[1],matches[2])
				}
				done = true
      }
		}
	})
	if (errs.length === 0)
		console.log("ok")
	else
		console.error(`Errors detected in file:${surveyfile}\n  ${errs.join("\n  ")}`)
// Remove working data inside survey structure
	delete survey.current	
	fs.writeFileSync(outfile,JSON.stringify(survey,null,2)+';\n')
})

