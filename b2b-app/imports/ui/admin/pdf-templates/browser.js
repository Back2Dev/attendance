import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import React from 'react'
import { useHistory } from 'react-router-dom'
import PdfTemplates from '/imports/api/pdf-templates/schema'
import { meteorCall } from '/imports/ui/utils/meteor'
import { obj2Search } from '/imports/api/util'
import Loader from '/imports/ui/components/commons/loading.js'
import PdfTemplatesBrowse from './browse'
import config from './config'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { TextField } from '@material-ui/core'
import { Button } from '/imports/ui/utils/generic'
import PdfPlayground from 'pd-playground'
import { Delete, Save } from '@material-ui/icons'
import clsx from 'clsx'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import CssBaseline from '@material-ui/core/CssBaseline'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import PdfTemplateContext from './context'

let push

const remove = (id) => meteorCall('rm.pdfTemplates', 'Deleting', id)
const update = (form) => meteorCall('update.pdfTemplates', 'updating', form)
const insert = (form) => meteorCall('insert.pdfTemplates', 'adding', form)
const add = () => push('/admin/pdf-templates/add')
const edit = (id) => push(`/admin/pdf-templates/edit/${id}`)
const browse = (id) => push(`/admin/pdf-templates/browse/${id}`)

const view = (id) => push(`/admin/pdf-templates/view/${id}`)
const archive = async (rowids) => {
  const name = prompt('Please enter a name for the archive')
  const text = confirm(
    'Are you sure you want to archive this PdfTemplates and related entities?'
  )

  if (name && text) {
    meteorCall('archive.pdfTemplates', `Archiving PdfTemplates to ${name}`, {
      name,
      ids: rowids,
    })
  }
}
const methods = { remove, update, insert, view, edit, add, archive, browse }

// const PdfTemplatesWrapper = (props) => {
// push = useHistory()?.push
//   // eslint-disable-next-line react/prop-types
//   if (props.loading) return <Loader loading />
//   return <PdfTemplatesBrowse {...props}></PdfTemplatesBrowse>
// }

// const PdfTemplatesNameLister = withTracker(
//   ({ setSelectedTemplate, selectedTemplate }) => {
//     const subsHandle = Meteor.subscribe('all.names.pdfTemplates')
//     const items = PdfTemplates.find({}, { fields: { name: 1 } }).map((row) => {
//       row.search = obj2Search(row)
//       return row
//     })
//     const columns = config.browse.columns
//     return {
//       items,
//       methods,
//       columns,
//       loading: !subsHandle.ready(),
//       // setSelectedTemplate,
//       // selectedTemplate,
//     }
//   }
// )(PdfTemplatesWrapper)

const PdfTemplatesBrowser = () => {
  const { items, item, setItem, pdfid, setPdfid } = React.useContext(PdfTemplateContext)

  // let docId = ''
  // if (
  //   window.location.pathname.slice(window.location.pathname.lastIndexOf('/') + 1) !==
  //   'pdf-templates'
  // ) {
  //   docId = window.location.pathname.slice(window.location.pathname.lastIndexOf('/') + 1)
  //   console.log('Setting docId from request path: ', docId)
  // }
  const [, setSample] = React.useState('')

  // const [selectedTemplate, setSelectedTemplate] = React.useState('')
  // const [file, setFile] = React.useState(item || { name: 'New Item' })

  // code state
  const [code, setCode] = React.useState(item.source || 'dd = {content: "Hello "}')
  push = useHistory()?.push
  // React.useEffect(() => {
  //   const items = PdfTemplates.find(
  //     { _id: selectedTemplate },
  //     { fields: { name: 1, source: 1 } }
  //   ).map((row) => {
  //     row.search = obj2Search(row)
  //     return row
  //   })
  //   console.log('items 1: ' + JSON.stringify(items[0]))
  //   console.log('selected  new template 1 ' + selectedTemplate)

  // if (items.length > 0) {
  //   setCode(items[0].source || 'dd = {content: ["Hello World!"]}')
  //   setFile(items[0])
  //   push(`/admin/pdf-templates/browse/${items[0]._id}`)
  // } else setCode('dd = {content: ["Hello World!"]}')
  //   if (item) {
  //     setCode(item.source || 'dd = {content: ["Hello World!"]}')
  //     setFile(item)
  //     push(`/admin/pdf-templates/browse/${item._id}`)
  //   }
  // }, [selectedTemplate, item])

  // React.useEffect(() => {
  //   const items = PdfTemplates.find(
  //     { _id: docId },
  //     { fields: { name: 1, source: 1 } }
  //   ).map((row) => {
  //     row.search = obj2Search(row)
  //     return row
  //   })
  //   console.log('items 2: ' + JSON.stringify(items[0]))
  //   console.log('selected  new template 2 ' + docId)
  //   //setSelectedTemplate(docId)

  //   if (items.length > 0) {
  //     setCode(items[0].source || 'dd = {content: ["Hello World!"]}')
  //     setFile(items[0])
  //     push(`/admin/pdf-templates/browse/${items[0]._id}`)
  //   } else setCode('dd = {content: ["Hello World!"]}')
  // }, [])

  // React.useEffect(() => {
  //   if (docId) {
  //     setSelectedTemplate(docId)
  //   }
  //   const items = PdfTemplates.find(
  //     { _id: selectedTemplate },
  //     { fields: { name: 1, source: 1 } }
  //   ).map((row) => {
  //     row.search = obj2Search(row)
  //     return row
  //   })
  //   console.log('items initial: ' + JSON.stringify(items[0]))
  //   console.log('selected starting template ' + selectedTemplate)

  //   if (items.length > 0) {
  //     setCode(items[0].source || 'dd = {content: ["Hello World!"]}')
  //     setFile(items[0])
  //     push(`/admin/pdf-templates/browse/${items[0]._id}`)
  //   } else setCode('dd = {content: ["Hello World!"]}')
  // }, [])

  React.useEffect(() => {
    setCode(item.source)
  }, [item, pdfid])

  const drawerWidth = 240

  const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      height: `calc(100% - 128px)`,
    },
    appBar: {
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginTop: '64px',
    },
    appBarShift: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginTop: '64px',
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    hide: {
      display: 'none',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
      marginTop: '64px',
      position: 'absolute',
      height: `calc(100% - 64px)`,
    },
    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
      justifyContent: 'flex-end',
    },
    content: {
      flexGrow: 1,
      // padding: theme.spacing(1),
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: -drawerWidth,
      marginTop: '64px',
      height: `calc(100 - 128px)`,
    },
    contentShift: {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
      width: `calc(100% - ${drawerWidth}px)`,
      height: `calc(100 - 128px)`,

      marginTop: '64px',
    },
  }))

  const classes = useStyles()
  const theme = useTheme()
  const [open, setOpen] = React.useState(false)

  const handleDrawerOpen = () => {
    setOpen(true)
  }

  const handleDrawerClose = () => {
    setOpen(false)
  }
  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
        height="64px"
        position="absolute"
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            {item ? item.name : 'New File'}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider />
        <PdfTemplatesBrowse
        // setSelectedTemplate={setSelectedTemplate}
        // selectedTemplate={selectedTemplate}
        />
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div
          style={{
            width: '95%',
            display: 'block',
            margin: '2%',
            border: '1px solid black',
            height: '100%',
            overflow: 'scroll',
          }}
        >
          <div
            style={{
              width: '100%',
              // height: '70%',
              border: 'solid grey 2%',
              // overflow: 'scroll',
            }}
          >
            <PdfPlayground code={code} setCode={setCode} />
          </div>
        </div>
        <div
        // style={{
        //   padding: '5px',
        //   width: '95%',
        //   margin: '2px',
        //   border: 'solid red 2px',
        // }}
        >
          <div style={{ float: 'left', marginLeft: '2.25%' }}>
            <Autocomplete
              id="message-search"
              style={{ width: 300 }}
              options={['Sample 1', 'Sample 2', 'Sample 3'].map((t) => t)}
              onChange={(event, newValue) => {
                setSample(newValue)
              }}
              renderInput={(params) => (
                <TextField {...params} label="Sample" variant="outlined" />
              )}
            />
          </div>
          <div style={{ float: 'right', marginRight: '4%' }}>
            <Button
              id={'delete'}
              key={'delete'}
              onClick={() => {
                methods.remove(pdfid)
                setPdfid(null)
              }}
              variant="contained"
              style={{ backgroundColor: 'red', color: 'white', marginRight: '10px' }}
            >
              <Delete />
              {'Delete'}
            </Button>
            <Button
              id={'add'}
              key={'add'}
              onClick={() => methods.update({ _id: pdfid, source: code })}
              color={'primary'}
              variant="contained"
            >
              <Save />
              {'Save'}
            </Button>
          </div>
        </div>
        {/* </div> */}
      </main>
    </div>
  )
}

export default PdfTemplatesBrowser
