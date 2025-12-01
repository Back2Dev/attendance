import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Container from '@mui/material/Container'
import TriggersTable from './triggers-table.js'
import TriggerEditor from './edit.js'

const TriggersList = ({ items, methods, defaultObject, messageTemplates }) => {
  const [editing, setEditing] = useState(null)

  useEffect(() => {
    if (editing) {
      const found = items.find((item) => item._id === editing._id)
      setEditing(found)
    }
  }, [items])

  return (
    <Container maxWidth="xl">
      <Box my={7}>
        <Paper>
          <Box m={4}>
            <Grid container spacing={3}>
              <Grid item md={5}>
                <TriggersTable
                  items={items}
                  editing={editing}
                  setEditing={setEditing}
                  methods={methods}
                  defaultObject={defaultObject}
                />
              </Grid>
              <Grid item md={7}>
                <TriggerEditor
                  editing={editing}
                  messageTemplates={messageTemplates}
                  methods={methods}
                  autoSave
                />
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </Container>
  )
}

TriggersList.propTypes = {
  loading: PropTypes.bool.isRequired,
  items: PropTypes.array.isRequired,
  methods: PropTypes.object.isRequired,
  defaultObject: PropTypes.object.isRequired,
  messageTemplates: PropTypes.array.isRequired,
}
export default TriggersList
