const debug = require('debug')('app:click-through')

// Listen to incoming HTTP requests (can only be used on the server).
WebApp.connectHandlers.use('/hello', (req, res, next) => {
  res.writeHead(200)
  res.end(`Hello world from: ${Meteor.release}`)
})

WebApp.connectHandlers.use('/bye', (req, res, next) => {
  // debug(req)
  res.writeHead(301, { Location: 'http://almsford.org' })
  res.end()
})

WebApp.connectHandlers.use('/tracking', (req, res, next) => {
  try {
    const event = {
      action: 'click',
      originalUrl: req.originalUrl,
      agent: req.headers['user-agent'],
      ip: req.socket.remoteAddress,
      query: req.query,
      when: new Date(),
    }
    console.log(event)
  } catch (e) {
    console.log(`Error ${e.message} in /tracking`)
  } finally {
    res.writeHead(301, { Location: req.query?.redirect })
    res.end()
  }
})

const trackImg = Buffer.from(
  'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
  'base64'
)

WebApp.connectHandlers.use('/pixel', (req, res, next) => {
  try {
    const pixelRead = {
      action: 'read',
      originalUrl: req.originalUrl,
      agent: req.headers['user-agent'],
      ip: req.socket.remoteAddress,
      query: req.query,
      when: new Date(),
    }
    console.log(pixelRead)
  } catch (e) {
    console.log(`Error ${e.message} in /pixel`)
  } finally {
    res.writeHead(200, {
      'Cache-Control': 'private, no-cache, proxy-revalidate, max-age=0',
      'Content-Type': 'image/gif',
      'Content-Disposition': 'inline',
      'Content-Length': trackImg.length,
    })
    res.end(trackImg)
  }
})
