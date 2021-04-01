import Profiles from '/imports/api/profiles/schema'

/**
 * get user email address
 * @param {Object} user - user from users collection
 * @return {string} email address
 */
export const getUserEmailAddress = (user) => {
  // get the user email, prefer last verified email address
  let emailAddress
  user?.emails?.forEach((email) => {
    if (!emailAddress || email.verified) {
      emailAddress = email.address
    }
  })
  return emailAddress
}

/**
 * check if user has role
 * @param {Object} user
 * @param {string} role
 * @returns {boolean}
 */
export const hasRole = (user, role) => {
  if (!user || !user.roles) {
    return false
  }
  return user.roles.some((item) => item._id === role)
}

export const getUserId = () => {
  try {
    return Meteor.userId()
  } catch (e) {
    return 'Unknown'
  }
}
