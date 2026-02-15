import { Meteor } from 'meteor/meteor'
import { saveJournal } from '/imports/api/journals/functions'
import Workflows from '/imports/api/workflows/schema'
import Projects from '/imports/api/projects/schema'
import MessageTemplates from '/imports/api/message-templates/schema'
import PdfTemplates from '/imports/api/pdf-templates/schema'
import Surveys from '/imports/api/surveys/schema'
import Triggers from '/imports/api/triggers/schema'
import { Tasks, Jobs } from '/imports/api/workflows/schema'
import Profiles from '/imports/api/profiles/schema'
import { createFileInRepo, deleteFile } from '../functions.js'
import objectSort from './object-sort'

const debug = require('debug')('app:asset-hooks')

const ghToken = Meteor.settings.private.GITHUB?.GITHUB_TOKEN

const assets = [
  { collection: 'workflows', schema: Workflows, updateRepo: true },
  { collection: 'triggers', schema: Triggers, updateRepo: true },
  { collection: 'projects', schema: Projects, updateRepo: true },
  {
    collection: 'message-templates',
    schema: MessageTemplates,
    textField: { html: 'HTMLbody', txt: 'body', mjml: 'mjml' },
    updateRepo: true,
  },
  {
    collection: 'pdf-templates',
    schema: PdfTemplates,
    textField: 'jsCode',
    updateRepo: true,
  },
  { collection: 'surveys', schema: Surveys, textField: 'source', updateRepo: true },
  // These ones are for journalling run time data
  { collection: 'jobs', schema: Jobs },
  { collection: 'tasks', schema: Tasks },
  { collection: 'profiles', schema: Profiles },
]

export const isJournalled = assets.map((asset) => asset.collection)

const lastUpdated = {}

const saveToRepo = async ({ project, doc, asset, prev, userId }) => {
  if (!ghToken) return Promise.resolve() // Just satisfy the await
  else {
    try {
      const when = new Date().getTime()
      debug(`saveToRepo ${asset.collection}/${doc.slug}`, when)
      const lastTime = lastUpdated[asset.collection]
      lastUpdated[asset.collection] = when
      if (lastUpdated[asset.collection] && when - lastTime < 500) {
        debug(`Debouncing file update`)
        return
      }
      const userName = userId
        ? (await Meteor.users.findOneAsync({ _id: userId })).username
        : 'System'
      let text, json
      // TODO: This will fail if the project is not found!
      const proj = await Projects.findOneAsync({ slug: project })
      if (!proj) {
        debug(`Project not found for "${project}"`)
        return Promise.resolve()
      }
      let slug = doc.slug
      const repo = proj.repo
      const branch = proj.branch
      const hasSlugChanged = slug !== prev.slug
      json = tidy(doc)
      if (asset.textField) {
        const fields =
          typeof asset.textField === 'string' ? { txt: asset.textField } : asset.textField

        for (const field of Object.keys(fields)) {
          const content = doc[fields[field]]
          if (content) {
            if (hasSlugChanged) {
              await deleteFile({
                path: `assets/${asset.collection}/${prev.slug}.${field}`,
                repo,
                branch,
                file: `${asset.collection}/${prev.slug}.${field}`,
                userName,
                rename: `${asset.collection}/${slug}.${field}`,
              })
            }
            await createFileInRepo({
              path: `assets/${asset.collection}/${slug}.${field}`,
              file: `${asset.collection}/${slug}.${field}`,
              content,
              repo,
              branch,
              userName,
            })
          }
        }
      }

      if (json) {
        if (hasSlugChanged) {
          await deleteFile({
            path: `assets/${asset.collection}/${prev.slug}.json`,
            repo,
            branch,
            file: `${asset.collection}/${prev.slug}.json`,
            userName,
            rename: `${asset.collection}/${slug}.json`,
          })
        }
        await createFileInRepo({
          path: `assets/${asset.collection}/${slug}.json`,
          file: `${asset.collection}/${slug}.json`,
          content: JSON.stringify(objectSort(json), null, 2),
          repo,
          branch,
          userName,
        })
      }
    } catch (e) {
      console.error(e)
    }
  }
}

async function afterUpdate(userId, prev, doc, asset) {
  try {
    // TODO: Should the `project` default to the slug? It feels like bad practice
    await saveJournal(asset.collection, prev, doc, userId)
    if (asset.updateRepo) {
      return await saveToRepo({
        project: doc.project || doc.slug,
        doc,
        asset,
        prev,
        userId,
      })
    }
  } catch (e) {
    console.error(e)
    debug(`Exception in ${asset.collection} asset hook: ${e.message}`)
  }
}

async function afterRemove(userId, prev, doc, asset) {
  try {
    const proj = await Projects.findOneAsync({ slug: doc.project })
    const repo = proj.repo
    const branch = proj.branch
    const userName = userId
      ? (await Meteor.users.findOneAsync({ _id: userId })).username
      : 'System'

    await deleteFile({
      path: `assets/${asset.collection}/${doc.slug}.json`,
      repo,
      branch,
      file: `${asset.collection}/${doc.slug}.json`,
      userName,
    })
    if (asset.textField) {
      const fields = Object.keys(
        typeof asset.textField === 'string' ? { txt: asset.textField } : asset.textField
      )
      for (const field of fields) {
        await deleteFile({
          path: `assets/${asset.collection}/${doc.slug}.${field}`,
          repo,
          branch,
          file: `${asset.collection}/${doc.slug}.${field}`,
          userName,
        })
      }
    }
  } catch (e) {
    console.error(e)
  }
}

async function beforeUpdate(userId, doc, fieldNames, modifier, options) {
  modifier.$set.updatedBy = userId
}

// Create the hooks on the asset collections
Meteor.startup(() => {
  if (Meteor.isServer && !Meteor.isTest) {
    //
    // Note that the hooks need to be functions, so that "this.previous" works
    // No fat arrow functions here!
    //
    for (const asset of assets) {
      if (asset.updateRepo) {
        // This one records who updated the record
        asset.schema.before.update(async function (
          userId,
          doc,
          fieldNames,
          modifier,
          options
        ) {
          await beforeUpdate(userId, doc, fieldNames, modifier, options)
        })
      }

      // This one allows us to track changes
      asset.schema.after.update(async function (userId, doc) {
        await afterUpdate(userId, this.previous, doc, asset)
      })

      // Track deletions
      if (asset.updateRepo) {
        asset.schema.after.remove(async function (userId, doc) {
          await afterRemove(userId, this.previous, doc, asset)
        })
      }
    }
  }
})

function tidy(object) {
  try {
    const { _id, createdAt, updatedAt, ...rest } = object
    return rest
  } catch (e) {
    return object
  }
}
