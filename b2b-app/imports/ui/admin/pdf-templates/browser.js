import React from 'react'
import { useHistory } from 'react-router-dom'
import PdfTemplatesBrowse from './browse'
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

const PdfTemplatesBrowser = () => {
  const { items, item, setItem, pdfid, setPdfid, methods, loadingPdfs } =
    React.useContext(PdfTemplateContext)
  const [, setSample] = React.useState('')
  const [file, setFile] = React.useState(item.name || 'New File')

  // code state
  const [code, setCode] = React.useState(item.source || 'dd = {content: "Hello "}')

  push = useHistory()?.push

  React.useEffect(() => {
    if (!pdfid || !item) {
      if (items.length > 0) {
        setItem(items[0])
      } else {
        setCode('dd = {content: ["Hello World!"]}')
        setFile('New File')
      }
    }
  }, [loadingPdfs])

  const handleSave = (e, form) => {
    if (pdfid) {
      methods.update({ _id: pdfid, source: code })
    } else {
      methods.save({ name: file, source: code, revision: 1 })
    }
  }

  React.useEffect(() => {
    setCode(item.source || 'dd = {content: ["Hello World!"]}')
  }, [item, pdfid])

  const drawerWidth = 240

  const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      height: `calc(100% - 128px)`,
      minHeight: '700px',
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
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: -drawerWidth,
      marginTop: '64px',
      height: `calc(100% - 128px)`,
      minHeight: '582px',
    },
    contentShift: {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
      width: `calc(100% - ${drawerWidth}px)`,
      height: `calc(100% - 128px)`,
      minHeight: '582px',
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
        <PdfTemplatesBrowse />
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
            minHeight: '560px',
          }}
        >
          <div
            style={{
              width: '100%',
              minHeight: '560px',
              border: 'solid grey 2%',
            }}
          >
            <PdfPlayground code={code} setCode={setCode} />
          </div>
        </div>
        <div>
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
              onClick={handleSave}
              color={'primary'}
              variant="contained"
            >
              <Save />
              {'Save'}
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default PdfTemplatesBrowser
