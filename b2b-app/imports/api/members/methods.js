import { Meteor } from 'meteor/meteor'
import { Match } from 'meteor/check'
import logger from '/imports/lib/log'
import CONSTANTS from '/imports/api/constants'
import Members, { AddBadgeParamsSchema } from './schema'

const debug = require('debug')('b2b:members')

Meteor.methods({
  'members.updateBio'({ bio }) {
    debug({ bio })
    if (!Match.test(bio, String)) {
      return { status: 'failed', message: 'Invalid bio' }
    }

    // check for login user
    if (!this.userId) {
      return { status: 'failed', message: 'Please login' }
    }
    const myMember = Members.findOne({ userId: this.userId })
    if (!myMember) {
      return { status: 'failed', message: 'Member was not found' }
    }

    try {
      Members.update(
        { _id: myMember._id },
        {
          $set: { bio },
        }
      )
    } catch (e) {
      return { status: 'failed', message: `Update failed: ${e.message}` }
    }

    return { status: 'success' }
  },
  /**
   * Admin adds a badge to a member
   * @param {String} memberId
   * @param {String} code
   * @returns {Object} result
   * @returns {String} result.status - success or failed
   * @returns {String} result.message
   */
  'members.addBadge'({ memberId, code }) {
    debug({ memberId, code })
    try {
      AddBadgeParamsSchema.validate({ memberId, code })
    } catch (error) {
      // debug(error)
      return { status: 'failed', message: error.message }
    }

    const theBadge = CONSTANTS.BADGES.find((item) => item.code === code)
    if (!theBadge) {
      return { status: 'failed', message: `The badge was not found with code: ${code}` }
    }

    // check for login user
    if (!this.userId) {
      return { status: 'failed', message: 'Please login' }
    }
    // check for admin role
    const me = Meteor.users.findOne({ _id: this.userId })
    const isAdm = me?.roles.some((role) => role._id === 'ADM')
    if (!isAdm) {
      return { status: 'failed', message: 'Permission denied' }
    }

    // get the member
    const member = Members.findOne({ _id: memberId })
    if (!member) {
      return { status: 'failed', message: `Member was not found with id: ${memberId}` }
    }

    const newBadge = {
      code,
      createdAt: new Date(),
    }
    if (theBadge.private) {
      newBadge.private = true
    }

    const updateData = member.badges
      ? {
          $push: { badges: newBadge },
        }
      : {
          $set: { badges: [newBadge] },
        }
    // debug('updateData', JSON.stringify(updateData))
    try {
      const updateResult = Members.update({ _id: memberId }, updateData)
      if (!updateResult) {
        return { status: 'failed', message: 'Unable to update member' }
      }
    } catch (error) {
      return { status: 'failed', message: error.message }
    }

    return { status: 'success' }
  },
  'rm.members': (id) => {
    try {
      Members.remove(id)
      logger.audit('Removed member', { id })
      return { status: 'success', message: 'Removed member' }
    } catch (e) {
      logger.error(`Error removing member: ${e.message}`, { id })
      return { status: 'failed', message: `Error removing member: ${e.message}` }
    }
  },
  'id.members': (id) => {
    return [Members.find(id)]
  },
  'update.members': (form) => {
    try {
      const id = form._id
      delete form._id
      const n = Members.update(id, { $set: form })
      logger.audit('Updated member', { id, form })
      return { status: 'success', message: `Updated ${n} member(s)` }
    } catch (e) {
      logger.error(`Error updating member: ${e.message}`, { form })
      return { status: 'failed', message: `Error updating member: ${e.message}` }
    }
  },
  'insert.members': (form) => {
    try {
      Members.insert(form)
      logger.audit('member added', form)
      return { status: 'success', message: 'Added member' }
    } catch (e) {
      logger.error(`Error adding member: ${e.message}`, form)
      return { status: 'failed', message: `Error adding member: ${e.message}` }
    }
  },
})
