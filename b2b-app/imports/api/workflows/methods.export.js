import { Meteor } from 'meteor/meteor'
import ServerSchema from 'meteor/aldeed:simple-schema'
import { DateTime } from 'luxon'
import { WorkflowsSchema } from '/imports/api/workflows/server/schema-def'
import Workflows from '/imports/api/workflows/schema'
import MessageTemplates from '/imports/api/message-templates/schema'
import CONSTANTS from '/imports/api/constants'
import templates from './export-templates'
import logger from '/imports/lib/log'
import Triggers from '../triggers/schema'
const debug = require('debug')('app:workflows:methods')

const OptionalDate = {
  type: Date,
  optional: true,
}

const WfMdSchema = WorkflowsSchema.omit('createdAt')
  .omit('updatedAt')
  .extend({ createdAt: OptionalDate, updatedAt: OptionalDate })
const icons = {
  PM: 'pm',
  CUS: 'cus',
  CON: 'con',
  AGT: 'agt',
}

const emptyTableCellFix = (cell) => {
  if (!cell) {
    return 'N/A'
  }
  return cell
}

const appendProbs = (probs) => {
  return Object.keys(probs)
    .map((prob) => {
      if (probs[prob].length)
        return [
          '',
          `### Problem in ${prob}:\n`,
          '',
          `  * ${probs[prob].join('\n  * ')}`,
          '',
        ]
    })
    .flat()
}

const getMessageTemplates = async () => {
  const msgList = await MessageTemplates.find({}).fetchAsync()
  const msgs = msgList.reduce((acc, item) => {
    if (acc[item.slug]) console.warn(`duplicate message slug ${item.slug}`)
    acc[item.slug] = item
    return acc
  }, {})
  return msgs
}

export const workflow2md = (workflow, msgs) => {
  const notifySections = [
    { id: 'ready', text: 'are sent when the step becomes ready' },
    { id: 'complete', text: 'are sent when the step is completed' },
    { id: 'reject', text: 'are sent when the step is rejected' },
    { id: 'skip', text: 'are sent when the step is skipped' },
  ]
  // First check the incoming data matches the schema
  try {
    new ServerSchema(WfMdSchema).validate(workflow)
    const probs = {
      dependencies: [],
      notifications: [],
      steps: [],
    }
    let md = []
    md.push(
      `---`,
      `slug: ${workflow.slug}`,
      `title: ${workflow.name}`,
      `---`,
      '',
      `import Permissions from '@site/src/components/permissions'
      import Tabs from '@theme/Tabs'
      import TabItem from '@theme/TabItem'
      `,
      '',
      `# ${workflow.name} workflow`,
      '',
      `*Version: ${workflow.version}*`,
      '<Tabs>'
    )
    if (workflow.stages) {
      const stepSlugs = {}
      workflow.stages.forEach((stage) => {
        stage.steps.forEach((step) => {
          const stepPath = [workflow.slug, stage.slug, step.slug].join('/')
          if (stepSlugs[step.slug])
            probs.steps.push(`${stepPath}: duplicate slug: ${step.slug}`)
          stepSlugs[step.slug] = step.name
        })
      })

      workflow.stages.map((stage, ix) => {
        let stageData = []
        stageData.push(
          `<TabItem value="${stage.slug}" label="${stage.name} stage" >`,
          '',
          `![${workflow.slug}-${stage.name}](/images/${workflow.slug}-${stage.slug}.png)`,
          '',
          `| ${stage.name} Stage Step | Responsible | Primary only |`,
          `|------|-------|---|`
        )
        stage.steps.forEach((step, ix) => {
          const s = step.singular ? 'Yes' : ''
          stageData.push(
            `| ${stage.name[0]}${ix + 1}. ${step.name} | ${
              CONSTANTS.ROLES[step.role]
            } | ${s} |`
          )
        })
        stage.steps.map((step, ix) => {
          const stepPath = [workflow.slug, stage.slug, step.slug].join('/')
          let depends = ''
          if (step.depends)
            depends = step.depends
              .map((dep) => {
                if (!stepSlugs[dep.id])
                  probs.dependencies.push(
                    `${stepPath}: Missing step: ${dep.id}/${dep.name}`
                  )
                return dep.name
              })
              .join('<br /> ')
          const icon = icons[step.role] || 'star'
          const stepNo = `${stage.name[0]}${ix + 1}`

          stageData.push(
            '',
            '--------',
            `### ![${icon}](/images/${icon}.png "${icon}") ${stepNo}: ${step.responsible} : ${step.name}`,
            '#### Description',
            step.description
          )
          if (step.instructions) stageData.push('#### Instructions', step.instructions)
          if (step.logic)
            stageData.push(
              `#### Logic`,
              '*`',
              step.logic
                .replace(/\r+/g, '')
                .replace(/\n+/g, '\n')
                .replace(/\n/g, '<br /><br />'),
              '`*'
            )
          stageData.push(
            step.singular ? 'Primary person only: Yes' : '',
            '',
            '| Responsible | Type | Step depends on |',
            '|----|----|----|',
            `| ${step.responsible} | ${step.type} | ${emptyTableCellFix(depends)} |`,
            ''
          )

          if (step.permissions) {
            let data = []
            Object.keys(step.permissions).forEach((key) => {
              data.push({ name: key, roles: step.permissions[key] })
            })
            stageData.push(
              '',
              '#### Permissions',
              '',
              `<Permissions data={${JSON.stringify(data)}} />`
            )
          }

          if (step.notifications && step.notifications.length) {
            notifySections.map((section) => {
              const nots = step.notifications?.filter((not) => not.trigger === section.id)
              if (nots?.length) {
                stageData.push(
                  '',
                  `#### These Notifications ${section.text}`,
                  '',
                  '| To | Type | Text | msgid |',
                  '|----|----|----|----|'
                )

                nots
                  .sort((a, b) => {
                    if (!a.recipients || !b.recipients) return 0
                    if (a.recipients[0] > b.recipients[0]) {
                      return 1
                    }
                    if (a.recipients[0] < b.recipients[0]) {
                      return -1
                    }
                    return 0
                  })
                  .map((notification, nn) => {
                    let body = msgs[notification.text]?.body || 'MISSING TEMPLATE'
                    if (body === 'MISSING TEMPLATE')
                      probs.notifications.push(
                        `${stepPath}: notification ${nn + 1} - MISSING TEMPLATE ${
                          notification.text
                        }`
                      )
                    if (Array.isArray(body)) body = body.join('')
                    body = body
                      .replace(/\*\|/g, '[[')
                      .replace(/\|\*/g, ']]')
                      .replace(/\|/g, '!')
                    const msgid =
                      notification.text?.length < 35
                        ? notification.text
                        : 'MISSING REFERENCE - text too long'
                    if (msgid === 'MISSING REFERENCE')
                      probs.notifications.push(
                        `${stepPath}: notification ${
                          nn + 1
                        } - MISSING REFERENCE - text too long`
                      )
                    const recipients =
                      CONSTANTS.ROLES[notification?.recipients?.join('')] ||
                      notification?.recipients?.join('')
                    stageData.push(
                      `| ${recipients} | ${notification.method}| ${body
                        .replace(/\r+/g, '')
                        .replace(/\n+/g, '<br /><br />')
                        .replace(/^"/, '')
                        .replace(/"$/, '')} | ${msgid}  |`
                    )
                    // console.log(body)
                  })
              }
            })
          } else {
            // stageData.push('', '#### Notifications', '', '_None_')
          }
          if (step.type === 'external') {
            stageData.push(
              '',
              `> ${step.instructions || 'Checklist items:'}`,
              '',
              step.external
                ?.map((chk) => `- [x] ${chk.name} ${!chk.optional ? '(required)' : ''}`)
                .join('\n')
            )
          }
        })

        md = md.concat(stageData)
        md = md.concat(`\n</TabItem>`)
      })
      md = md.concat(`</Tabs>`)
    }

    // check the dependencies

    // Dump out the problems at the end
    md = md.concat(appendProbs(probs))
    return md.join('\n')
  } catch (e) {
    debug('error when generating md:', e.message)
    throw e
  }
}

const merge = (contents, step) => {
  let templated = contents
  const m = templated.match(/{{(\w+)}}/)
  while (m) {
    templated = templated.replace(new RegExp(`{{${m[1]}}}`), step[m[1]])
  }
  return templated
}

export const workflow2cypress = (workflow, msgs) => {
  try {
    const steps = workflow.stages.map((stage) => stage.steps).flat()
    let parts = [templates.header]
    let role = ''
    parts = parts.concat(
      steps.map((step) => {
        step.name = step.name.replace(/['"]/g, '') // Get rid of quote characters in name
        if (step.role !== role) {
          const login = step.role === 'PART' ? templates.loginCUS : templates.login
          const res = `${role && '}) // Log off.\n'} 
          ${merge(login, step)}
          ${merge(templates[step.type], step)}`
          role = step.role
          return res
        }
        role = step.role
        return merge(templates[step.type], step)
      })
    )
    parts.push(templates.footer)
    const result = parts.join('\n')
    return result
  } catch (e) {
    debug('error when generating cypress script:', e.message)
    throw e
  }
}

export const workflow2msgmd = (workflow, msgs) => {
  // First check the incoming data matches the schema
  try {
    new ServerSchema(WfMdSchema).validate(workflow)
    const probs = {
      dependencies: [],
      notifications: [],
      steps: [],
    }
    let md = []

    md.push(
      `---`,
      `name: ${workflow.slug}`,
      'menu: Notifications',
      `---`,
      '',
      '',
      `# ${workflow.name} workflow - notifications`,
      '',
      `_Document generated: ${DateTime.now().toLocaleString(DateTime.DATETIME_SHORT)}_ `,
      '',
      `*Version: ${workflow.version}*`,
      ''
    )
    if (workflow.stages) {
      const stepSlugs = {}
      workflow.stages.forEach((stage) => {
        stage.steps.forEach((step) => {
          const stepPath = [workflow.slug, stage.slug, step.slug].join('/')
          if (stepSlugs[step.slug])
            probs.steps.push(`${stepPath}: duplicate slug: ${step.slug}`)
          stepSlugs[step.slug] = step.name
        })
      })

      md = md.concat(workflow.stages.map((stage) => `* ${stage.name}`))
      md.push('')

      workflow.stages.map((stage) => {
        let stageData = []

        stage.steps.map((step, ix) => {
          const stepPath = [workflow.slug, stage.slug, step.slug].join('/')
          if (step.depends)
            step.depends
              .map((dep) => {
                if (!stepSlugs[dep.id])
                  probs.dependencies.push(
                    `${stepPath}: Missing step: ${dep.id}/${dep.name}`
                  )
                return dep.name
              })
              .join('<br /> ')
          const icon = icons[step.role] || 'star'
          const stepNo = `${stage.name[0]}${ix + 1}`
          stageData.push(
            '',
            '--------',
            `## ![${icon}](/images/${icon}.png "${icon}") ${stepNo}: ${step.responsible} : ${step.name}`
          )

          if (step.notifications && step.notifications.length) {
            const triggers = [
              {
                trigger: 'ready',
                name: 'Notifications sent when step becomes READY (ie before) ',
              },
              {
                trigger: 'reject',
                name: 'Notifications sent when step is REJECTED ',
              },
              {
                trigger: 'complete',
                name: 'Notifications sent when step is DONE (ie after) ',
              },
            ]

            triggers.map((t) => {
              if (
                step.notifications &&
                step.notifications.filter((n) => n.trigger === t.trigger)?.length
              ) {
                stageData.push(
                  '',
                  `### ${t.name}`,
                  '',
                  '| Id | To | Text |',
                  '|----|----|----|'
                )

                step.notifications
                  .filter((n) => n.trigger === t.trigger)
                  .sort((a, b) => {
                    if (!a.recipients || !b.recipients) return 0
                    if (a.recipients[0] > b.recipients[0]) {
                      return 1
                    }
                    if (a.recipients[0] < b.recipients[0]) {
                      return -1
                    }
                    return 0
                  })
                  .map((notification, nn) => {
                    let body = msgs[notification.text]?.body || 'MISSING TEMPLATE'
                    if (body === 'MISSING TEMPLATE')
                      probs.notifications.push(
                        `${stepPath}: notification ${nn + 1} - MISSING TEMPLATE - ${
                          notification.text
                        }`
                      )
                    if (Array.isArray(body)) body = body.join('')
                    body = body
                      .replace(/\*\|/g, '[[')
                      .replace(/\|\*/g, ']]')
                      .replace(/\|/g, '!')
                    const msgid =
                      notification.text.length < 35
                        ? notification.text
                        : 'MISSING REFERENCE'
                    if (msgid === 'MISSING REFERENCE')
                      probs.notifications.push(
                        `${stepPath}: notification ${
                          nn + 1
                        } - MISSING REFERENCE - id too long`
                      )
                    const recipients = notification?.recipients
                      ?.map((role) => CONSTANTS.ROLES[role])
                      .join('<br />')
                    stageData.push(
                      `| ${msgid} (${notification.method}) | ${recipients} | ${body
                        .replace(/\r+/g, '')
                        .replace(/\n+/g, '<br /><br />')
                        .replace(/^"/, '')
                        .replace(/"$/, '')} |`
                    )
                  })
              }
            })
          } else {
            stageData.push('', '_No notifications_')
          }
          if (step.permissions) {
            let data = []
            Object.keys(step.permissions).forEach((key) => {
              data.push({ name: key, roles: step.permissions[key] })
            })
          }
          if (step.instructions) stageData.push('#### Instructions', step.instructions)
          if (step.type === 'external') {
            const inst = !step.instructions
              ? 'Please check items after they are complete:'
              : ''
            stageData.push(
              '',
              inst,
              step.external
                ?.map((chk) => `- [x] ${chk.name} ${!chk.optional ? '(required)' : ''}`)
                .join('\n')
            )
          }
        })

        md = md.concat(stageData)
      })
    }
    // check the dependencies

    // Dump out the problems at the end
    md.concat(['', '---'])
    Object.keys(probs).forEach((prob) => {
      if (probs[prob].length)
        md = md.concat([
          '',
          `### Problem in ${prob}:\n`,
          '',
          `  * ${probs[prob].join('\n  * ')}`,
          '',
        ])
    })
    return md.join('\n')
  } catch (e) {
    debug('error when generating md:', e.message)
    throw e
  }
}

export const triggers2md = (triggers, msgs) => {
  // First check the incoming data matches the schema
  const probs = {
    dependencies: [],
    notifications: [],
    steps: [],
  }
  try {
    let md = []
    md.push(
      `---`,
      `name: triggers`,
      'menu: Notifications',
      `---`,
      `# Non-workflow notifications `,
      '',
      `_Document generated: ${DateTime.now().toLocaleString(DateTime.DATETIME_SHORT)}_`,
      '',
      'This document provides a catalogue of notifications that are triggered by non-workflow events, such as "Forgot password", "Listing added" e.t.c.',
      '',
      'See also the workflow notifications documents'
    )
    triggers.map((t, ix) => {
      const revDate = t.revisedAt
        ? DateTime.fromJSDate(t.revisedAt).toLocaleString(DateTime.DATETIME_SHORT)
        : 'N/A'

      md.push(
        '',
        '---',
        `# ${ix + 1}. ${t.name}`,
        `Slug: *${t.slug}*\n\n_Revision: ${t.revision || 1}, Last updated: ${revDate}_ `
      )
      md.push('', '| Id | To | Text |', '|----|----|----|')

      t.notifications
        .sort((a, b) => {
          if (!a.recipients || !b.recipients) return 0
          if (a.recipients[0] > b.recipients[0]) {
            return 1
          }
          if (a.recipients[0] < b.recipients[0]) {
            return -1
          }
          return 0
        })
        .map((notification, nn) => {
          let body = msgs[notification.text]?.body || 'MISSING TEMPLATE'
          if (body === 'MISSING TEMPLATE')
            probs.notifications.push(
              `${t.slug}: notification ${nn + 1} - MISSING TEMPLATE - ${
                notification.text
              }`
            )
          if (Array.isArray(body)) body = body.join('')
          body = body.replace(/\*\|/g, '[[').replace(/\|\*/g, ']]').replace(/\|/g, '!')
          const msgid =
            notification.text.length < 35 ? notification.text : 'MISSING REFERENCE'
          if (msgid === 'MISSING REFERENCE')
            probs.notifications.push(
              `${t.slug}: notification ${nn + 1} -  MISSING REFERENCE`
            )
          const recipients = notification?.recipients
            ?.map((role) => CONSTANTS.ROLES[role])
            .join('<br />')
          md.push(
            `| ${msgid} (${notification.method}) | ${recipients} | ${body
              .replace(/\r+/g, '')
              .replace(/\n+/g, '<br /><br />')
              .replace(/^"/, '')
              .replace(/"$/, '')} |`
          )
        })
    })
    // Dump out the problems at the end
    md = md.concat(appendProbs(probs))
    return md.join('\n')
  } catch (e) {
    debug('error when generating md:', e.message)
    throw e
  }
}

Meteor.methods({
  'generate.workflow.md': async (id) => {
    try {
      const wf = await Workflows.findOneAsync(id)
      const msgs = await getMessageTemplates()
      const result = workflow2md(wf, msgs)
      logger.info(`Generated workflow ${wf.slug} markdown`, {
        workflowId: id,
        slug: wf.slug,
      })
      return { status: 'success', result }
    } catch (e) {
      logger.error('error when generating workflow md:', { message: e.message, id })
      return { status: 'failed', message: e.message }
    }
  },
  'generate.cypress.script': async (id) => {
    try {
      const wf = await Workflows.findOneAsync(id)
      const msgs = await getMessageTemplates()
      const result = workflow2cypress(wf, msgs)
      logger.info(`Generated workflow ${wf.slug} test script`, {
        workflowId: id,
        slug: wf.slug,
      })
      return { status: 'success', result }
    } catch (e) {
      logger.error('error when generating cypress script:', { message: e.message, id })
      return { status: 'failed', message: e.message }
    }
  },
  'generate.wfmessages.md': async (id) => {
    try {
      const wf = await Workflows.findOneAsync(id)
      const msgs = await getMessageTemplates()
      const result = await workflow2msgmd(wf, msgs)
      logger.info(`Generated workflow ${wf.slug} message document`, {
        workflowId: id,
        slug: wf.slug,
      })
      return { status: 'success', result }
    } catch (e) {
      logger.error('error when generating wf messages md:', { message: e.message, id })
      return { status: 'failed', message: e.message }
    }
  },
  'generate.triggers.md': async (id) => {
    try {
      const triggers = await Triggers.find({}).fetchAsync()
      const msgs = await getMessageTemplates()
      const result = await triggers2md(triggers, msgs)
      logger.info(`Generated triggers markdown`)
      return { status: 'success', result }
    } catch (e) {
      logger.error('error when generating triggers md:', { message: e.message, id })
      return { status: 'failed', message: e.message }
    }
  },
})
