import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import Button from '@material-ui/core/Button'
import { Box, Container, Grid, Typography } from '@material-ui/core'
import config from './config'

const people = [
  { userId: 'mikkel', name: 'Mike' },
  { userId: 'pato', name: 'Pat' },
]

export default Meeting = () => {
  return (
    <span>
      <div>This is a meeting</div>
      <h2>Team members</h2>
      {people.map((person) => (
        <div>{person.name}</div>
      ))}
    </span>
  )
}
