import React, { createElement } from 'react'
import debug from 'debug'
import { useParts } from '/imports/ui/forms/survey-builder/recoil/hooks'
import makeStyles from '@mui/styles/makeStyles';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import PublishIcon from '@mui/icons-material/Publish'
import ImageIcon from '@mui/icons-material/Image'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import DnsIcon from '@mui/icons-material/Dns'
import ShortTextIcon from '@mui/icons-material/ShortText'
import { Droppable, Draggable } from 'react-beautiful-dnd'

const log = debug('builder:parts')

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    'flex-direction': 'column',
    '& > *': {
      margin: theme.spacing(1),
    },
  },

  item: {
    padding: '1rem',
  },
  list: {
    flexGrow: 1,
    maxWidth: 752,
  },
}))

const partIcons = [
  { part: 'section', icon: DnsIcon },
  { part: 'single', icon: RadioButtonCheckedIcon },
  { part: 'multiple', icon: CheckBoxIcon },
  { part: 'text', icon: ShortTextIcon },
  { part: 'image', icon: ImageIcon },
  { part: 'upload', icon: PublishIcon },
]

const Parts = () => {
  const { addPart } = useParts()
  const classes = useStyles()
  // FIXME add onClose/Open handlers for drawer

  return (
    <div className={classes.list}>
      <Droppable key={'parts'} droppableId={`parts`} type="canvas">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            <List>
              {partIcons.map((item, index) => (
                <Draggable key={item.part} draggableId={item.part} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <ListItem
                        onClick={() => addPart(item.part)}
                        className={classes.item}
                      >
                        <ListItemAvatar>
                          <Avatar>{createElement(item.icon)}</Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={item.part.toUpperCase()} />
                      </ListItem>
                      <Divider variant="inset" component="li" />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </List>
          </div>
        )}
      </Droppable>
    </div>
  )
}

export { Parts }
