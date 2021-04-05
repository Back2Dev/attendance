import React from 'react'
import PropTypes from 'prop-types'
import { Box, Container, Typography } from '@material-ui/core'
import HTMLTemplate from '/imports/api/email-template'

const debug = require('debug')('se:edit')

const View = ({ item }) => {
  const itemHTML = item.body
    .split(/\n/)
    .map((line) => `<p>${line}</p>`)
    .join('\n')
  console.log(itemHTML)
  return (
    <Container>
      <Box my={7}>
        <Typography variant="h1">Message template: {item.name}</Typography>
        <Typography color="primary" variant="h5">
          {item.type} (Revision {item.revision}: &nbsp;
          {moment(item.updatedAt).format('DD/MM/YY HH:mm')} )
        </Typography>
        <br />
        {item.type === 'EMAIL' ? (
          <Typography
            dangerouslySetInnerHTML={{
              __html: HTMLTemplate.replace('*|contents|*', itemHTML).replace(
                '*|subject|*',
                '--- SUBJECT GOES HERE ---'
              ),
            }}
          />
        ) : (
          <Typography
            dangerouslySetInnerHTML={{
              __html: itemHTML,
            }}
          />
        )}
      </Box>
    </Container>
  )
}

View.propTypes = {
  item: PropTypes.object.isRequired,
}
export default View
