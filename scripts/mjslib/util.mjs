import simpleDDP from 'simpleddp'
import { simpleDDPLogin } from 'simpleddp-plugin-login'
import ws from 'isomorphic-ws'
import fs from 'fs'
import { file } from 'tmp-promise'
import dbg from 'debug'
const debug = dbg('app:mjslib/util')

export const myrequireJSON = (filename) => {
  try {
    debug(`Reading file ${filename}`)
    // import() caches file contents, and to get around it,
    // we read the file and copy it to a temp file, and then import
    // that. This may cause a memory leak over time.
    const contents = fs.readFileSync(filename, { encoding: 'utf8' })
    const data = JSON.parse(contents)
    if (data && data.slug) debug(`Read JSON for: ${data.slug}/${data.name}`)
    return data
  } catch (e) {
    console.error(e)
  }
}

export const getMeteorURI = ({ opts }) => {
  const server = opts.server || 'localhost'
  let port = opts.port || '2060'
  let protocol = opts.port === 443 ? 'wss' : 'ws'
  if (server !== 'localhost') {
    protocol = 'wss'
    port = '443'
  }
  return `${protocol}://${server}:${port}/websocket`
}

export const meteorLogin = async ({ opts, endpoint = getMeteorURI({ opts }) }) => {
  debug(`Logging in to Meteor server on ${endpoint}`)
  const meteor = new simpleDDP(
    {
      endpoint: endpoint,
      SocketConstructor: ws,
      reconnectInterval: 5000,
    },
    [simpleDDPLogin]
  )
  const credentials = {
    password: opts.pass || process.env.P,
    user: {
      username: opts.user || process.env.U,
    },
  }
  debug({ credentials })
  let userAuth = await meteor.login(credentials)
  return meteor
}

export const rmAsset = ({ dir, slug, asset }) => {
  fs.mkdirSync(dir, { recursive: true })
  let file = `${dir}/${slug}.json`
  if (fs.existsSync(file)) {
    fs.unlinkSync(file)
    debug(`Removed file ${file}`)
  }
  if (asset === 'pdfTemplates') {
    file = `${dir}/${slug}.txt`
    if (fs.existsSync(file)) {
      fs.unlinkSync(file)
      debug(`Removed file ${file}`)
    }
  }
}

export const saveAsset = ({ dir, slug, asset, contents }) => {
  fs.mkdirSync(dir, { recursive: true })
  const killers = 'id createdAt updatedAt'.split(/\s+/g)
  killers.forEach((key) => delete contents[key])
  let file = `${dir}/${slug}.json`
  fs.writeFileSync(file, JSON.stringify(contents, null, 2))
  debug(`Saved file ${file}`)
  if (asset === 'pdfTemplates') {
    const js = contents.jsCode || 'dd = {content: "Hello "}'
    const jsText = `// Saved js code to text file for convenient change tracking\n${js}`
    file = `${dir}/${slug}.txt`
    fs.writeFileSync(file, jsText)
    debug(`Saved file ${file}`)
  }
}

// Note that this function is NOT async, no need to do an await...
export const importJSON = (filename) => {
  try {
    debug(`Reading file ${filename}`)
    // import() caches file contents, and to get around it,
    // we read the file and copy it to a temp file, and then import
    // that. This may cause a memory leak over time.
    const contents = fs.readFileSync(filename, { encoding: 'utf8' })
    const data = JSON.parse(contents)
    debug(`Read JSON for: ${data.slug}/${data.name}`)
    return data
  } catch (e) {
    console.error(e)
  }
}

// Note that this function IS async, you need to do an await...
export const importJS = async (filename) => {
  try {
    debug(`Reading file ${filename}`)
    // import() caches file contents, and to get around it,
    // we read the file and copy it to a temp file, and then import
    // that. This may cause a memory leak over time.
    let contents = fs.readFileSync(filename, { encoding: 'utf8' })
    const postfix = filename.match(/\.js$/) ? '.mjs' : '.json'
    // Import the temp file to see if it's ok
    // debug(`Importing temp file: ${path}`)
    const { fd, path, cleanup } = await file({ postfix })
    const importableContents = contents.replace(
      /^\s*module.exports\s*=/,
      'export default '
    )
    if (importableContents !== contents) contents = importableContents
    // work with file here in fd
    fs.writeSync(fd, contents)
    const js = await import(path)
    // debug({ js: js.default })
    cleanup()
    return js.default // The survey is the default export
  } catch (e) {
    console.error(e)
  }
}

export const slugify = (text) => {
  if (!text || typeof text !== 'string') return 'no-name'
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
}
