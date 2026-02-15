import React from 'react'
import { Meteor } from 'meteor/meteor'
import { useHistory } from 'react-router-dom'
import dbg from 'debug'
const debug = dbg('app:anonymous')

/**
 * This page handles short codes, and redirects to the right place
 *
 * @param {} props
 * @returns
 */
const Anon = (props) => {
  const [msg, setMsg] = React.useState('Loading - please wait...')
  const { replace } = useHistory()
  const token = props.match.params.token
  if (!token) return <span>404 Token not found</span>

  React.useEffect(() => {
    // Read saved url from localstorage
    const url = sessionStorage.getItem(token)
    Meteor.callAsync('get.redirect.code', token, url)
      .then((res) => {
        debug({ res })
        if (res.status === 'success' && res.url) {
          sessionStorage.setItem(token, res.url)
          setMsg('')
          replace(res.url)
        } else {
          sessionStorage.removeItem(token)
          setMsg(`Something went wrong: ${res.message}, please refresh to try again`)
        }
      })
      .catch((err) => {
        console.error('Error getting redirect code', err)
      })
  }, [])

  return <span> {msg}</span>
}

export default Anon
