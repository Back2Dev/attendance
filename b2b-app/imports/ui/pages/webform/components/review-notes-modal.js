import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles, List, Button } from '@material-ui/core'
import Modal from '/imports/ui/components/commons/modal'
import NoteCard from '/imports/ui/components/notes/note-card'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    position: 'relative',
    overflow: 'auto',
    maxHeight: 400,
    fontFamily: 'GothamRoundedMedium',
  },
}))

export default function ReviewNotes({ handleClose, open, notes }) {
  const classes = useStyles()
  const Content = () => {
    return (
      <List className={classes.root}>
        {notes &&
          notes.map((note, index) => {
            return (
              <NoteCard
                key={note.who + index}
                {...note}
                classProps={{ maxHeight: 400 }}
              />
            )
          })}
      </List>
    )
  }

  const CallToAction = () => {
    return (
      <>
        <Button onClick={handleClose} color="inherit" variant="contained">
          Close
        </Button>
      </>
    )
  }

  return (
    <Modal
      handleClose={handleClose}
      open={open}
      title={'Review Notes'}
      content={<Content />}
      cta={<CallToAction />}
    />
  )
}

ReviewNotes.propTypes = {
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  notes: PropTypes.array.isRequired,
}
