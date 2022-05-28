import React, { createElement } from 'react'
import debug from 'debug'
import { useParts } from '/imports/ui/forms/survey-builder/recoil/hooks'
import { makeStyles } from '@material-ui/core/styles'
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked'
import CheckBoxIcon from '@material-ui/icons/CheckBox'
import PublishIcon from '@material-ui/icons/Publish'
import ImageIcon from '@material-ui/icons/Image'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemText from '@material-ui/core/ListItemText'
import Avatar from '@material-ui/core/Avatar'
import Divider from '@material-ui/core/Divider'
import DnsIcon from '@material-ui/icons/Dns'
import ShortTextIcon from '@material-ui/icons/ShortText'
import SubjectIcon from '@material-ui/icons/Subject'
import Filter1Icon from '@material-ui/icons/Filter1'

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
  { part: 'short', icon: ShortTextIcon },
  { part: 'long', icon: SubjectIcon },
  { part: 'number', icon: Filter1Icon },
  { part: 'image', icon: ImageIcon },
  { part: 'upload', icon: PublishIcon },
]

const Parts = () => {
  const { addPart } = useParts()
  const classes = useStyles()
  // FIXME add onClose/Open handlers for drawer

  return (
    <div className={classes.list}>
      <List>
        {partIcons.map((item) => (
          <div key={item.part}>
            <ListItem onClick={() => addPart(item.part)} className={classes.item}>
              <ListItemAvatar>
                <Avatar>{createElement(item.icon)}</Avatar>
              </ListItemAvatar>
              <ListItemText primary={item.part.toUpperCase()} />
            </ListItem>
            <Divider variant="inset" component="li" />
          </div>
        ))}
      </List>
    </div>
  )
}

export { Parts }
