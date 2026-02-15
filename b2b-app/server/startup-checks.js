import { Meteor } from 'meteor/meteor'
import Workflows, { Jobs, Stages } from '/imports/api/workflows/schema'
import Triggers from '/imports/api/triggers/schema'
import Surveys from '/imports/api/surveys/schema'
import PdfTemplates from '/imports/api/pdf-templates/schema'
import MessageTemplates from '/imports/api/message-templates/schema'
import { Roles } from 'meteor/alanning:roles'
// import CONSTANTS from '/imports/api/constants'

const debug = require('debug')('app:startup-checker')

Meteor.startup(async () => {
  const { status, message, errs } = await Meteor.callAsync('startupCheck')
})

Meteor.methods({
  // TODO: check if we use this method in cronjob
  async startupCheck(arg) {
    try {
      let doChecks = true
      // If we are running on localhost, AND we are connected to prod,
      // then we need environment variable DO_CHECKS to be truthy
      // to run migrations
      if (
        Meteor.absoluteUrl().match(/localhost/) &&
        Meteor.settings.env.environment === 'prod' &&
        !process.env.DO_CHECKS
      )
        doChecks = false
      if (Meteor.isServer && doChecks) {
        console.log(
          ' - - - - - - - A P P     S T A R T U P     C H E C K E R - - - - - - - - -'
        )
        const errs = []
        // Build an index of the message templates
        const mts = {}
        await MessageTemplates.find({})?.forEachAsync((mt) => {
          mts[mt.slug] = { template: mt, refs: 0 }
        })
        // Check for notification templates
        await Triggers.find({ slug: { $ne: 'unknown-trigger' } }) // This is a special case
          .forEachAsync((t) => {
            t.notifications?.forEach((n, nix) => {
              if (mts[n.text]) mts[n.text].refs = mts[n.text].refs + 1
              else
                errs.push(
                  `Missing msg template [${nix}]: ${n.text} for Trigger: ${t.slug}`
                )
            })
          })
        const WORKFLOW_CHECK = true
        const surveys = await Surveys.find({}).fetchAsync()
        const pdfTemplates = await PdfTemplates.find({}).fetchAsync()
        if (WORKFLOW_CHECK) {
          // Check for workflow notification templates:
          await Workflows.find({}).forEachAsync(async (wf) => {
            const paths = {}
            wf.stages.forEach((stg) => {
              stg.steps.forEach((step) => {
                paths[step.slug] = `${wf.slug}/${stg.slug}/${step.slug}`
                step.notifications?.forEach((n, nix) => {
                  if (mts[n.text]) mts[n.text].refs = mts[n.text].refs + 1
                  else {
                    errs.push(
                      `Missing msg template [${nix}]: ${n.text} for Step: ${
                        paths[step.slug]
                      }`
                    )
                  }
                })
                if (step.webform && !surveys.find((s) => step.webform === s.slug))
                  errs.push(
                    `Missing survey ${step.webform} ${wf.slug}/${stg.slug}/${step.slug}`
                  )
                if (step.webform && !pdfTemplates.find((s) => step.webform === s.slug))
                  errs.push(
                    `Missing pdf template ${step.webform} ${wf.slug}/${stg.slug}/${step.slug}`
                  )
              })
            })
            // Check dependencies
            wf.stages.forEach((stg) => {
              stg.steps.forEach((step) => {
                step.depends?.forEach((dep) => {
                  if (!paths[dep.id])
                    errs.push(
                      `Dependency refers to missing task ${dep.id} => ${wf.slug}/${stg.slug}/${step.slug}`
                    )
                })
              })
            })
            // Check logic
            /*   if document.roc.missing goto assign-con
             *   if document.cos.signed complete me
             *   if document.roc.present goto read-review
             *   if document.roc.exists skip another-task
             *   if document.roc.exists skipall another-task # - This is a cascading skip
             */
            const verbs = 'skip skipall goto reopen complete ready'.split(/\s+/)
            wf.stages.forEach((stg) => {
              stg.steps.forEach((step) => {
                step.logic?.split(/\n/).forEach((line) => {
                  const m = line.match(/(\w+)\s+(\S+)\s*$/)
                  if (m && verbs.includes(m[1]) && m[2] !== 'me' && !paths[m[2]])
                    errs.push(
                      `Missing task ${m[2]} => ${wf.slug}/${stg.slug}/${step.slug} logic: ${line}`
                    )
                })
              })
            })
            // Check notifications for missing from and fromName
            wf.stages.forEach((stg) => {
              stg.steps.forEach((step) => {
                step.notifications?.forEach((n) => {
                  if (['EMAIL', 'SMS'].includes(n.method) && !n.from)
                    errs.push(
                      `Workflow: Missing from for ${n.method} (${n.text}) notification in ${wf.slug}/${stg.slug}/${step.slug}`
                    )
                })
              })
            })
          })
        }

        // Check triggers
        await Triggers.find({}).forEachAsync((t) => {
          // check notifications for missing from and fromName
          t.notifications?.forEach((n) => {
            if (['EMAIL', 'SMS'].includes(n.method) && !n.from)
              errs.push(
                `Trigger: Missing from for ${n.method} (${n.text}) notification in ${t.slug}`
              )
          })
        })

        // Report on unused message templates:
        const norefs = Object.keys(mts).filter((slug) => mts[slug].refs === 0)
        if (norefs.length)
          debug(`There are ${norefs.length} unused message templates: ${norefs.join()}`)

        // Check users
        // await Meteor.users.find({}).mapAsync((user) => {
        //   // look for users with no roles
        //   const roles =await Roles.getRolesForUserAsync(user._id)
        //   if (!roles?.length) {
        //     errs.push(`User ${user.username || '?'}/${user._id || '?'} has no roles`)
        //     return
        //   }
        //   // check if this user has unknown roles
        //   const availableRoles = Object.keys(CONSTANTS.ROLES)
        //   roles.map((role) => {
        //     if (!availableRoles.includes(role)) {
        //       errs.push(
        //         `User ${user.username || '?'}/${user._id || '?'} has unknown role: ${role}`
        //       )
        //     }
        //   })
        // })

        // Report any errors
        if (errs.length) console.log(JSON.stringify(errs, null, 2))
        console.log(
          ' - - - - - - - A P P    C O M P L E T E D     C H E C K E R - - - - - - - - -'
        )
        return { status: 'success', errs }
      } else {
        const message = 'Skipped startup checks'
        console.log(message)
        return { status: 'failed', message }
      }
    } catch (e) {
      console.error(e)
      const message = ` *** *** *** Exception in startup-checker: ${e.message}`
      return { status: 'failed', message }
    }
  },
})
