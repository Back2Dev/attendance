/**
 * lib/log
 *
 * This module uses dynamic imports to implement different
 * behaviour on the client and the server.
 *
 * Server-side, we log using Winston and push to Loggly, and track
 * errors using Raven/Sentry.
 * On the client, we just log to the console.
 *
 * How it works
 *
 */

import { Meteor } from 'meteor/meteor'
import Logs from '/imports/api/logs/schema'
import Audits from '/imports/api/audits/schema'

// these methods will be stubbed until the dynamic import is ready
const PROXY_METHODS = ['debug', 'info', 'error', 'warn', 'audit']

// calls to the methods are pushed into the queue
const PROXY_CALL_QUEUE = []

// build a proxy object that gets exported with each of the  methods above
// stubbed to just push into the queue
let proxy = PROXY_METHODS.reduce(
  (proxyObject, methodName) => ({
    ...proxyObject,
    [methodName]: (...args) => {
      PROXY_CALL_QUEUE.push({
        methodName,
        args,
      })
    },
  }),
  {}
)

// restores the proxy with method from an imported module
function restoreProxy(proxyObject, proxyMethods, module) {
  proxyMethods.forEach((methodName) => {
    proxyObject[methodName] = module[methodName] // eslint-disable-line no-param-reassign
  })
}

// replays the queued calls to the restored proxy
function replayQueue(proxyObject, queue) {
  while (queue.length) {
    const item = queue.shift()
    proxyObject[item.methodName](...item.args)
  }
}

function getUserId() {
  try {
    return Meteor.userId()
  } catch (e) {
    return 'Unknown'
  }
}

if (Meteor.isServer) {
  import('./server/log').then((module) => {
    // proxy = module.default
    restoreProxy(proxy, PROXY_METHODS, module.default)
    replayQueue(proxy, PROXY_CALL_QUEUE)
  })
} else {
  import('./client/log').then((module) => {
    restoreProxy(proxy, PROXY_METHODS, module.default)
    replayQueue(proxy, PROXY_CALL_QUEUE)
  })
}

export function createAudit({ event, data, user }) {
  try {
    if (Meteor.isClient) return
  } catch (e) {}
  try {
    Audits.insert({ event, data, user })
  } catch (e) {
    console.error('Error creating audit entry ', e)
  }
}
export function createLog({ type, message, data, user }) {
  try {
    if (Meteor.isClient) return
  } catch (e) {}
  try {
    Logs.insert({
      level: type,
      message: message || 'No message',
      user: getUserId(),
      data,
    })
  } catch (e) {
    console.error('Error creating log entry ', e)
  }
}

export default proxy
