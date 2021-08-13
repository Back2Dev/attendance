import { showSuccess, showInfo, showError } from '/imports/ui/utils/toast-alerts'

/*
 Call a Meteor method and wait for the response.
 
 @param {string} method - Meteor method name
 @param {string} description - Description of what the method does, eg "Updating"
 @param {any} params - Parameter for method call, if more than one, use an object
 @param {boolean} slow - true if method is slow, and you want a pre-alert
*/
export const meteorCall = async (method, description, params, slow) => {
  try {
    if (slow) showInfo(description || `Calling ${method}`)
    const s = await Meteor.callAsync(method, params)

    if (s)
      if (s.status === 'success') {
        if (description && s.message)
          showSuccess(params.autosave ? 'Form autosaved' : s.message)
      } else {
        showError(`Error ${s.message}`)
      }
    return s
  } catch (e) {
    showError(`Error ${e.message}`)
    return { status: 'failed', message: e.message }
  }
}
