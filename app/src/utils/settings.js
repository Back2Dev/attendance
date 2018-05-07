// settings.js

//
// This file will contain default settings, and a method to fetch them.
// Settings can be overridden by using environment variables of the same name, 
//  eg. REACT_APP_API_URL=http://apiserver.com:8080/ npm start
//
const default_settings = {
  'REACT_APP_API_URL':  'http://localhost:3300/',
}


export const getSetting = (name) => {
	let value = process.env[name]
	if (!value) {
		if (default_settings[name]) {
		  console.warn(`Warning: no config for ${name}, defaulting to ${default_settings[name]}`)
		  return default_settings[name]
		} else {
			throw new Error(`No environment variable or default value for [${name}]`)
		}
	}
	return value
}
