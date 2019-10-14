// Meteor utilities
import { Meteor } from 'meteor/meteor'
import Alert from 'react-s-alert'

export const uploadPartsPrices = e => {
  e.preventDefault()

  const file = e.target[0].files[0]
  const msg = file ? 'Adding your parts' : 'Oops! Forgot to add the file? Try again uploading the file'
  Alert.info(msg)
  const reader = new FileReader()
  reader.onloadend = function () {
    const data = reader.result
    Meteor.callAsync('parts.load', data)
  }
  reader.readAsBinaryString(file)
}
