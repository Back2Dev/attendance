/* global Roles */
import { Meteor } from 'meteor/meteor'
import { Match } from 'meteor/check'
import logger from '/imports/lib/log'
import CONSTANTS from '/imports/api/constants'
import Members, { AddBadgeParamsSchema } from './schema'
import Events, { MemberItemSchema } from '../events/schema'
import moment from 'moment'
import Jobs from '../jobs/schema'

const debug = require('debug')('b2b:members')

Meteor.methods({
  'members.byRole'({ role, fields }) {
    if (!Match.test(role, String)) {
      return { status: 'failed', message: 'Role must be a string' }
    }

    // check if role is existing
    if (!Object.keys(CONSTANTS.ROLES).includes(role)) {
      return { status: 'failed', message: `Role was not found: ${role}` }
    }

    // find the user
    const users = Roles.getUsersInRole(role)

    const userIds = users.map((user) => user._id)
    if (!userIds?.length) {
      return {
        status: 'success',
        members: [],
      }
    }

    const selectedFields = fields || {
      userId: 1,
      name: 1,
      nickname: 1,
    }

    const members = Members.find(
      { userId: { $in: userIds } },
      { fields: selectedFields }
    ).fetch()

    return { status: 'success', members }
  },
  'members.search'({ keyword }) {
    if (!Match.test(keyword, String)) {
      return { status: 'failed', message: 'Keyword must be string' }
    }
    // find the member
    const members = Members.find(
      {
        $text: {
          $search: keyword,
          // $search: `"${keyword}"`
        },
      },
      {
        fields: {
          _id: 1,
          userId: 1,
          name: 1,
          mobile: 1,
          email: 1,
          avatar: 1,
          address: 1,
          score: { $meta: 'textScore' },
        },
        sort: {
          score: { $meta: 'textScore' },
        },
      }
    ).fetch()

    const membersWithHistory = members.map((item) => {
      // select jobs which are related to this member
      const prevJobs = Jobs.find(
        { memberId: item._id },
        {
          fields: {
            make: 1,
            model: 1,
            color: 1,
            bikeType: 1,
            totalCost: 1,
            dropoffDate: 1,
            pickupDate: 1,
            status: 1,
            createdAt: 1,
          },
          sort: {
            createdAt: -1,
          },
        }
      ).fetch()

      return { ...item, history: prevJobs }
    })

    return { status: 'success', members: membersWithHistory }
  },
  'members.updateBio'({ bio, favorites }) {
    debug({ bio, favorites })
    if (!Match.test(bio, String)) {
      return { status: 'failed', message: 'Invalid bio' }
    }
    if (!Match.test(favorites, [String])) {
      return { status: 'failed', message: 'Invalid favorites' }
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
          $set: { bio, favorites },
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
   * @param {Boolean} overwrite
   * @returns {Object} result
   * @returns {String} result.status - success or failed
   * @returns {String} result.message
   */
  'members.addBadge'({ memberId, code, overwrite = false }) {
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
    const isAdm = Roles.userIsInRole(me, ['ADM'])

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

    const updateCondition = { _id: memberId }
    const updateData = member.badges
      ? {
          $push: { badges: newBadge },
        }
      : {
          $set: { badges: [newBadge] },
        }
    // debug('updateData', JSON.stringify(updateData))

    // check if the member has this badge already
    const existingBadge = member.badges.find((item) => item.code === code)
    if (existingBadge) {
      if (!overwrite) {
        return {
          status: 'failed',
          message: `Member ${memberId} has had this badge already since: ${moment(
            existingBadge.createdAt
          ).format('DD/MM/YYYY HH:mm:SS')}`,
        }
      }
      // else pull existing item
      delete updateData.$push
      updateCondition.badges = { $elemMatch: { code } }
      updateData.$set = { 'badges.$': newBadge }
    }

    try {
      const updateResult = Members.update(updateCondition, updateData)
      if (!updateResult) {
        return { status: 'failed', message: 'Unable to update member' }
      }
    } catch (error) {
      return { status: 'failed', message: error.message }
    }

    // update the members array of event
    const updatedMember = Members.findOne({ _id: memberId })
    if (updatedMember) {
      Events.update(
        {
          members: {
            $elemMatch: { _id: memberId },
          },
        },
        {
          $set: {
            'members.$[].badges': updatedMember.badges,
          },
        },
        { multi: true }
      )
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
