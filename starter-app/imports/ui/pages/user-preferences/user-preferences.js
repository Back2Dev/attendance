import React, { useState, useContext } from 'react'
import {
  Avatar,
  Box,
  Container,
  Grid,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Tabs,
  Tab,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { AccountContext } from '/imports/ui/contexts/account-context.js'
import UploadAvatar from '/imports/ui/hacks/aws/upload-avatar-box.js'
import TabPanel from '/imports/ui/components/tab-panel.js'
import PersonalInfo from './personal-info.js'
import ChangePassword from './change-password.js'
import SignPage from '/imports/ui/components/add-signature/sign-page.js'
import { convertAvatar } from '/imports/api/util.js'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: '100%',
  },
  avatar: {
    width: theme.spacing(12),
    height: theme.spacing(12),
    marginRight: '20px',
  },
  userInfo: {
    width: '100%',
    maxWidth: 500,
    margin: '20px 0',
  },
  tabContent: {
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '80%',
      textAlign: 'center',
      margin: 'auto',
    },
  },
  tabs: {
    textAlign: 'center',
    '& .MuiTabs-flexContainer': {
      display: 'block',
    },
  },
}))

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`,
  }
}

export default UserPreferences = () => {
  const [tab, setTab] = useState(0)

  const handleTabs = (event, newValue) => {
    setTab(newValue)
  }

  const classes = useStyles()

  const { profile, user, loading } = useContext(AccountContext)

  const userPrefMenu = [
    {
      display: 'Personal',
      component: () => {
        return <PersonalInfo />
      },
    },
    {
      display: 'Password',
      component: () => <ChangePassword />,
    },
    {
      display: 'Photo',
      component: () => <UploadAvatar />,
    },
    {
      display: 'Signature',
      component: () => <SignPage />,
    },
  ]

  return (
    <Container className={classes.root}>
      {!loading && (
        <Box mt={7}>
          <Grid container spacing={3} direction="column" alignItems="center">
            <Grid item xs={12} sm={6}>
              <Typography
                variant="h1"
                data-cy="user-account"
                className={classes.title}
                align="center"
              >
                User account
              </Typography>
              <List className={classes.userInfo}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar
                      src={convertAvatar(profile?.avatar)}
                      className={classes.avatar}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={profile && profile.name}
                    secondary={user && user.username}
                    primaryTypographyProps={{ variant: 'h5', noWrap: true }}
                    secondaryTypographyProps={{ noWrap: true }}
                  />
                </ListItem>
              </List>
            </Grid>
          </Grid>
          <Grid container spacing={3} direction="column" alignItems="center">
            <Grid item xs={12} className={classes.tabs}>
              <Tabs
                value={tab}
                onChange={handleTabs}
                indicatorColor="primary"
                textColor="primary"
                variant="scrollable"
                scrollButtons="auto"
                aria-label="scrollable auto tabs example"
              >
                {userPrefMenu &&
                  userPrefMenu.map((item, index) => (
                    <Tab key={index} label={item.display} {...a11yProps(index)} />
                  ))}
              </Tabs>
              <div className={classes.tabContent}>
                {userPrefMenu &&
                  userPrefMenu.map((item, index) => (
                    <TabPanel key={index} value={tab} index={index}>
                      {item.component()}
                    </TabPanel>
                  ))}
              </div>
            </Grid>
          </Grid>
        </Box>
      )}
    </Container>
  )
}
