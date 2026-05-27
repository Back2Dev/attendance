/* global Roles */
import { Meteor } from 'meteor/meteor'
import { Match } from 'meteor/check'
import logger from '/imports/lib/log'
import CONSTANTS from '/imports/api/constants'
import Profiles, { AddBadgeParamsSchema } from './schema'
import Events, { MemberItemSchema } from '../events/schema'
import moment from 'moment'
import Jobs from '../jobs/schema'

const debug = require('debug')('app:profiles')

Meteor.methods({
  'profiles.byRole': async function ({ role, fields }) {
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

    const members = await Profiles.find(
      { userId: { $in: userIds } },
      { fields: selectedFields }
    ).fetchAsync()

    return { status: 'success', members }
  },
  'profiles.search': async function ({ keyword }) {
    if (!Match.test(keyword, String)) {
      return { status: 'failed', message: 'Keyword must be string' }
    }
    const pattern = new RegExp(keyword, 'i')
    // find the member
    const members = await Profiles.find(
      {
        $or: [
          {
            $text: {
              $search: keyword,
              // $search: `"${keyword}"`
              $diacriticSensitive: true,
            },
          },
          { name: { $regex: pattern } },
          { mobile: { $regex: pattern } },
          { email: { $regex: pattern } },
          { address: { $regex: pattern } },
        ],
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
    ).fetchAsync()

    const membersWithHistory = await Promise.all(
      members.map(async (item) => {
        // select jobs which are related to this member
        const prevJobs = await Jobs.find(
          { profileId: item._id },
          {
            fields: {
              bikeName: 1,
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
        ).fetchAsync()

        return { ...item, history: prevJobs }
      })
    )

    return { status: 'success', members: membersWithHistory }
  },
  'profiles.updateBio': async function ({ bio, favorites }) {
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
    const myMember = await Profiles.findOneAsync({ userId: this.userId })
    if (!myMember) {
      return { status: 'failed', message: 'Member was not found' }
    }

    try {
      await Profiles.updateAsync(
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
   * @param {String} profileId
   * @param {String} code
   * @param {Boolean} overwrite
   * @returns {Object} result
   * @returns {String} result.status - success or failed
   * @returns {String} result.message
   */
  'profiles.addBadge': async function ({ profileId, code, overwrite = false }) {
    debug({ profileId, code })
    try {
      AddBadgeParamsSchema.validate({ profileId, code })
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
    const me = await Meteor.users.findOneAsync({ _id: this.userId })
    const isAdm = Roles.userIsInRole(me, ['ADM'])

    if (!isAdm) {
      return { status: 'failed', message: 'Permission denied' }
    }

    // get the member
    const member = await Profiles.findOneAsync({ _id: profileId })
    if (!member) {
      return { status: 'failed', message: `Member was not found with id: ${profileId}` }
    }

    const newBadge = {
      code,
      createdAt: new Date(),
    }
    if (theBadge.private) {
      newBadge.private = true
    }

    const updateCondition = { _id: profileId }
    const updateData = member.badges
      ? {
          $push: { badges: newBadge },
        }
      : {
          $set: { badges: [newBadge] },
        }
    // debug('updateData', JSON.stringify(updateData))

    // check if the member has this badge already
    const existingBadge = member.badges?.find((item) => item.code === code)
    if (existingBadge) {
      if (!overwrite) {
        return {
          status: 'failed',
          message: `Member ${profileId} has had this badge already since: ${moment(
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
      // debug('updateData', JSON.stringify(updateData, null, 2))
      const updateResult = await Profiles.updateAsync(updateCondition, updateData)
      if (!updateResult) {
        return { status: 'failed', message: 'Unable to update member' }
      }
    } catch (error) {
      return { status: 'failed', message: error.message }
    }

    // update the members array of event
    const updatedMember = await Profiles.findOneAsync({ _id: profileId })
    if (updatedMember) {
      try {
        await Events.updateAsync(
          {
            members: {
              $elemMatch: { _id: profileId },
            },
          },
          {
            $set: {
              // TODO: I think Meteor mongo doesn't support $[]
              // Minh: Meteor mongo supports but the problem is simpl-schema doesn't support it.
              // https://github.com/longshotlabs/simpl-schema/issues/378
              'members.$[].badges': updatedMember.badges,
            },
          },
          { multi: true }
        )
      } catch (e) {
        debug('error updating event:', e.message)
      }
    }

    return { status: 'success' }
  },
  'rm.profiles': async (id) => {
    try {
      await Profiles.removeAsync(id)
      logger.audit('Removed member', { id })
      return { status: 'success', message: 'Removed member' }
    } catch (e) {
      logger.error(`Error removing member: ${e.message}`, { id })
      return { status: 'failed', message: `Error removing member: ${e.message}` }
    }
  },
  'id.profiles': (id) => {
    return [Profiles.find(id)]
  },
  'update.profiles': async (form) => {
    try {
      const id = form._id
      const roles = form.roles
      delete form._id
      delete form.roles
      const n = await Profiles.updateAsync(id, { $set: form })
      const m = await Profiles.findOneAsync(id)
      await Roles.setUserRoles(m.userId, roles)
      logger.audit('Updated member', { id, form })
      return { status: 'success', message: `Updated ${n} member(s)` }
    } catch (e) {
      logger.error(`Error updating member: ${e.message}`, { form })
      return { status: 'failed', message: `Error updating member: ${e.message}` }
    }
  },
  'insert.profiles': async (form) => {
    try {
      await Profiles.insertAsync(form)
      logger.audit('member added', form)
      return { status: 'success', message: 'Added member' }
    } catch (e) {
      logger.error(`Error adding member: ${e.message}`, form)
      return { status: 'failed', message: `Error adding member: ${e.message}` }
    }
  },
})
