import { Meteor } from 'meteor/meteor'
import logger from '/imports/lib/log'
import Surveys from './schema'
import getSchemas from './survey-schema-simple'
import { generateAndUpload } from '/imports/api/s3-utils'

Meteor.methods({
  'rm.surveys': async (id) => {
    try {
      await Surveys.removeAsync(id)
      logger.info('Removed survey', { id })
      return { status: 'success', message: 'Removed survey' }
    } catch (e) {
      logger.error(`Error removing survey: ${e.message}`, { id })
      return {
        status: 'failed',
        message: `Error removing survey: ${e.message}`,
      }
    }
  },
  'update.surveys': async (form) => {
    try {
      const id = form._id
      delete form._id
      const n = await Surveys.updateAsync(id, { $set: form })
      logger.info('Survey updated', form)
      return { status: 'success', message: `Updated ${n} survey(s)` }
    } catch (e) {
      logger.error(`Error updating survey: ${e.message}`, form)
      return {
        status: 'failed',
        message: `Error updating survey: ${e.message}`,
      }
    }
  },
  'insert.surveys': async (form) => {
    try {
      await Surveys.insertAsync(form)
      logger.info('Inserted survey', form)
      return { status: 'success', message: 'Added survey' }
    } catch (e) {
      logger.error(`Error adding survey: ${e.message}`, form)
      return {
        status: 'failed',
        message: `Error adding survey: ${e.message}`,
      }
    }
  },
  'generate.survey.filler': async (id) => {
    try {
      const survey = typeof id === 'object' ? id : await Surveys.findOneAsync(id)
      if (!survey) return { status: 'failed', message: 'Not found' }
      getSchemas(survey)
      logger.info('generated survey filler', { id })
      return { status: 'success', survey }
    } catch (err) {
      logger.error('error when generating survey filler:', err)
      return { status: 'failed', message: err.message }
    }
  },
   'upsert.slug.surveys': async (form, options) => {
    try {
      const rec = await Surveys.findOneAsync({ slug: form.slug })
      let result
      if (rec) {
        const _id = rec._id
        delete rec._id
        const unset = {}
        // Compare the old version of the record,
        Object.keys(rec)
          .filter((key) => !key.match(/_id|At|By$/))
          .forEach((key) => {
            if (!form.hasOwnProperty(key)) unset[key] = 1 // Remove keys not in the new record
          })
        await Surveys.updateAsync({ _id }, { $set: form, $unset: unset })
        result = { status: 'success', message: `Updated survey ${form.slug}` }
      } else {
        const id = await Surveys.insertAsync(form)
        result = { status: 'success', message: `Added survey ${form.slug}` }
      }
      if (options?.add) {
        const code = await Codes.findOneAsync({ letters: form.slug })
        if (!code) {
          const n = await Codes.insert({
            letters: form.slug,
            docType: form.slug,
            url: '/r-:responseId',
          })
          if (n) result.message = result.message + `, code added for ${form.slug}`
        } else result.message = result.message + `, code for ${form.slug} already present`
      }
      debug({ message: result.message })
      return result
    } catch (e) {
      console.error(e)
      return {
        status: 'failed',
        message: `Error adding survey: ${e.message}`,
      }
    }
  },

  // 'generate.save.survey': async (form) => {
  //   try {
  //     const { type, data } = form
  //     if (data.status !== 'complete')
  //       return {
  //         status: 'failed',
  //         message: 'form is not yet complete',
  //       }

  //     const survey = Surveys.findOne({ slug: type })
  //     if (!survey)
  //       return {
  //         status: 'failed',
  //         message: `No survey found with type: ${type}`,
  //       }

  //     form.fields = [...survey.primary, ...survey.secondary]
  //     const result = await generateAndUpload(form)
  //     if (result.status !== 'success') {
  //       return { status: 'failed', message: result.message }
  //     }
  //     logger.info('Generated and saved pdf to s3', form)
  //     return {
  //       status: 'success',
  //       message: 'Generated and saved pdf to s3',
  //       url: `document-templates/${type}.pdf`,
  //     }
  //   } catch (e) {
  //     logger.error('error when generating survey pdf:', e)
  //     return { status: 'failed', message: e.message }
  //   }
  // },
  // TODO - this isn't called by anything - it also doesn't do anything !
  // 'sign.save.survey': async ({ userId, form }) => {
  //   try {
  //     const { type, data } = form

  //     logger.info('successfully uploaded signed pdf to s3', {
  //       user: userId,
  //       docType: type,
  //       data: data,
  //     })
  //     return {
  //       status: 'success',
  //       message: 'successfully uploaded signed pdf to s3',
  //     }
  //   } catch (e) {
  //     logger.error('Error when uploading signed pdf to s3', { message: e.message })
  //     return { status: 'failed', message: e.message }
  //   }
  // },
})
