import Alert from 'react-s-alert'

/*
 Call a Meteor method and wait for the response.
 
 @param {string} method - Meteor method name
 @param {string} description - Description of what the method does, eg "Updating"
 @param {any} params - Parameter for method call, if more than one, use an object
 @param {boolean} slow - true if method is slow, and you want a pre-alert
*/
export const meteorCall = async (method, description, params, slow) => {
  try {
    if (slow) Alert.info(description || `Calling ${method}`)
    const s = await Meteor.callAsync(method, params)
    if (s.status === 'success') {
      Alert.success(s.message)
    } else {
      Alert.error(`Error ${s.message}`)
    }
  } catch (e) {
    Alert.error(`Error ${e.message}`)
  }
}
