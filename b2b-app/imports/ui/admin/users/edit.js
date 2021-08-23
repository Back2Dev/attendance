import React, { useState, useEffect } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import PropTypes from 'prop-types'
import Breadcrumbs from '@material-ui/core/Breadcrumbs'
import Link from '@material-ui/core/Link'
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import TabPanel from '/imports/ui/components/tab-panel.js'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import EditUser from './components/edit-user.js'
import UserMessages from './components/user-messages.js'

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: '36px',
    marginBottom: '36px',
  },
  paper: {
    padding: '20px 50px',
    minHeight: '80vh',
  },
}))

function a11yProps(index) {
  return {
    id: `tab-${index}`,
    'aria-controls': `tabpanel-${index}`,
  }
}

export default function UserEditTabs({
  user,
  member,
  messages,
  editUser,
  setPassword,
  sendResetPasswordEmail,
  sendConfirmationEmail,
  suspendMember,
  setActiveMember,
}) {
  const [tab, setTab] = useState(0)

  const classes = useStyles()

  const handleChange = (event, newValue) => {
    setTab(newValue)
  }

  const content = [
    {
      id: 'edit-user',
      label: 'Edit User',
      component: (
        <EditUser
          member={member}
          user={user}
          editUser={editUser}
          setPassword={setPassword}
          sendResetPasswordEmail={sendResetPasswordEmail}
          sendConfirmationEmail={sendConfirmationEmail}
          suspendMember={suspendMember}
          setActiveMember={setActiveMember}
        />
      ),
    },
    {
      id: 'view-messages',
      label: `Messages (${messages.length})`,
      component: <UserMessages messages={messages} />,
    },
  ]

  return (
    <Container maxWidth="lg" className={classes.root}>
      <Breadcrumbs aria-label="property-breadcrumb" className={classes.breadcrumb}>
        <Link component={RouterLink} to={'/admin/users'}>
          All users
        </Link>
        <Typography color="textPrimary">{member?.name || 'User'}</Typography>
      </Breadcrumbs>
      <Paper className={classes.paper}>
        {member ? (
          <>
            <Tabs
              value={tab}
              indicatorColor="primary"
              textColor="primary"
              onChange={handleChange}
              aria-label="disabled tabs example"
            >
              {content.map((item, index) => {
                return (
                  <Tab
                    label={item.label}
                    id={`tab-${item.id}`}
                    key={item.id}
                    {...a11yProps(index)}
                  />
                )
              })}
            </Tabs>
            <div className={classes.content} style={{ height: '100%' }}>
              {content.map((item, index) => {
                return (
                  <TabPanel
                    value={tab}
                    index={index}
                    id={`content-${item.id}`}
                    key={`content-${item.id}`}
                    {...a11yProps(index)}
                    height="100%"
                  >
                    {item.component}
                  </TabPanel>
                )
              })}
            </div>
          </>
        ) : (
          <Typography align="center" variant="h6">
            Please select a customer
          </Typography>
        )}
      </Paper>
    </Container>
  )
}

UserEditTabs.propTypes = {
  user: PropTypes.object.isRequired,
  member: PropTypes.object.isRequired,
  messages: PropTypes.array.isRequired,
  editUser: PropTypes.func.isRequired,
  setPassword: PropTypes.func.isRequired,
  sendResetPasswordEmail: PropTypes.func.isRequired,
  sendConfirmationEmail: PropTypes.func.isRequired,
  suspendMember: PropTypes.func.isRequired,
  setActiveMember: PropTypes.func.isRequired,
}
