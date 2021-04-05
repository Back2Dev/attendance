import { Meteor } from 'meteor/meteor'
import logger from '/imports/lib/log'
import Surveys from './schema'
import getSchemas from './survey-schema-simple'
import { generateAndUpload } from '/imports/api/s3-utils'

Meteor.methods({
  'rm.surveys': (id) => {
    try {
      Surveys.remove(id)
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
  'update.surveys': (form) => {
    try {
      const id = form._id
      delete form._id
      const n = Surveys.update(id, { $set: form })
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
  'insert.surveys': (form) => {
    try {
      Surveys.insert(form)
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
  'generate.survey.filler': (id) => {
    try {
      const survey = typeof id === 'object' ? id : Surveys.findOne(id)
      if (!survey) return { status: 'failed', message: 'Not found' }
      getSchemas(survey)
      logger.info('generated survey filler', { id })
      return { status: 'success', survey }
    } catch (err) {
      logger.error('error when generating survey filler:', err)
      return { status: 'failed', message: err.message }
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
