/* global Roles */
import { Meteor } from 'meteor/meteor'

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
 * @returns {Promise<boolean>}
 */
export const hasRole = async (user, role) => {
  if (!user) {
    return false
  }
  return Roles.userIsInRoleAsync(user, [role])
}

/**
 * check if user has role
 * @param {Object} user
 * @param {string[]} roles
 * @returns {Promise<boolean>}
 */
export const hasOneOfRoles = async (user, roles) => {
  if (!user) {
    return false
  }
  return Roles.userIsInRoleAsync(user, roles)
}

export const getUserId = () => {
  try {
    return Meteor.userId()
  } catch (e) {
    return 'Unknown'
  }
}
