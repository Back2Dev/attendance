import React from 'react'
import PropTypes from 'prop-types'
import { DateTime } from 'luxon'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import { makeStyles } from '@material-ui/core/styles'
import EmailIcon from '@material-ui/icons/Email'
import { AutoForm, AutoField, ErrorsField, SubmitField } from 'uniforms-material'
import SimpleSchema from 'simpl-schema'
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2'
import MaterialPhoneNumber from '/imports/ui/components/mui-phone-number.js'
import CONSTANTS from '/imports/api/constants.js'
import { convertAvatar, wordSeparator } from '/imports/api/util.js'
import SetPassword from './set-password.js'
import SuspendAccount from './suspend-account.js'
import RestoreAccount from './restore-account.js'

export const userSchema = new SimpleSchema2Bridge(
  new SimpleSchema({
    name: {
      type: String,
      max: 200,
      label: 'Full name',
      optional: true,
    },
    nickname: {
      type: String,
      max: 200,
      label: 'Preferred name',
      optional: true,
    },
    username: {
      type: String,
      max: 200,
      regEx: SimpleSchema.RegEx.EmailWithTLD,
      label: 'Email',
    },
    mobile: {
      type: String,
      min: 6,
      max: 50,
      regEx: SimpleSchema.RegEx.Phone,
      uniforms: {
        component: MaterialPhoneNumber,
      },
      optional: true,
    },
    roles: {
      type: Array,
      uniforms: {
        checkboxes: true,
      },
    },
    'roles.$': {
      type: String,
      allowedValues: Object.keys(CONSTANTS.ROLES).sort(),
      uniforms: {
        transform: (value) => {
          return CONSTANTS.ROLES[value]
        },
      },
    },
  })
)

const useStyles = makeStyles((theme) => ({
  topGrid: {
    marginBottom: '20px',
  },
  leftGrid: {},
  bold: {
    fontFamily: 'GothamRoundedMedium',
  },
  avatar: {
    width: '150px',
    height: '150px ',
    marginBottom: '20px',
  },
  mobile: {
    marginTop: '8px',
    marginBottom: '4px',
  },
  actions: {
    '& > *': {
      margin: '5px',
    },
  },
  roles: {
    '& .MuiFormGroup-root': {
      display: 'inline',
      textAlign: 'left',
    },
    marginTop: '8px',
    marginBottom: '15px',
  },
}))

export default function EditUser({
  user,
  member,
  editUser,
  setPassword,
  sendResetPasswordEmail,
  suspendMember,
  setActiveMember,
  sendConfirmationEmail,
}) {
  const classes = useStyles()

  const confirmationToken = user?.services?.email?.confirmationToken

  const userInfo = [
    {
      status: 'pending',
      info: (
        <>
          {confirmationToken && (
            <>
              <TableRow>
                <TableCell className={classes.bold}>
                  Confirmation first sent on:
                </TableCell>
                <TableCell align="right">
                  {DateTime.fromJSDate(confirmationToken?.createdAt)
                    .setZone('Australia/Sydney')
                    .toLocaleString(DateTime.DATETIME_SHORT)}
                </TableCell>
              </TableRow>
              {confirmationToken.updatedAt && (
                <TableRow>
                  <TableCell className={classes.bold}>
                    Confirmation last sent on:
                  </TableCell>
                  <TableCell align="right">
                    {DateTime.fromJSDate(confirmationToken?.updatedAt)
                      .setZone('Australia/Sydney')
                      .toLocaleString(DateTime.DATETIME_SHORT)}
                  </TableCell>
                </TableRow>
              )}
              <TableRow>
                <TableCell className={classes.bold}>Confirmation expiry:</TableCell>
                <TableCell align="right">
                  {DateTime.fromJSDate(confirmationToken?.expiryAt)
                    .setZone('Australia/Sydney')
                    .toLocaleString(DateTime.DATETIME_SHORT)}
                </TableCell>
              </TableRow>
            </>
          )}
        </>
      ),
      actions: (
        <Grid container spacing={1}>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              startIcon={<EmailIcon />}
              onClick={() => sendConfirmationEmail()}
            >
              Resend invite
            </Button>
          </Grid>
        </Grid>
      ),
    },
    {
      status: 'suspended',
      info: (
        <>
          <TableRow>
            <TableCell className={classes.bold}>Last logged in:</TableCell>
            <TableCell align="right">
              {member?.onlineStatus?.offlineTimeoutAt
                ? DateTime.fromJSDate(member?.onlineStatus?.offlineTimeoutAt)
                    .setZone('Australia/Sydney')
                    .toLocaleString(DateTime.DATETIME_SHORT)
                : 'Not found'}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.bold}>Notify by:</TableCell>
            <TableCell align="right">{wordSeparator(member?.notifyBy)}</TableCell>
          </TableRow>
        </>
      ),
    },
    {
      status: 'active',
      info: (
        <>
          <TableRow>
            <TableCell className={classes.bold}>Last logged in:</TableCell>
            <TableCell align="right">
              {member?.onlineStatus?.offlineTimeoutAt
                ? DateTime.fromJSDate(member?.onlineStatus?.offlineTimeoutAt)
                    .setZone('Australia/Sydney')
                    .toLocaleString(DateTime.DATETIME_SHORT)
                : 'Not found'}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.bold}>Notify by:</TableCell>
            <TableCell align="right">{wordSeparator(member?.notifyBy)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.bold}>Linked services:</TableCell>
            <TableCell align="right">
              {wordSeparator(
                Object.keys(user?.services).filter((service) =>
                  ['google', 'facebook', 'password'].includes(service)
                )
              )}
            </TableCell>
          </TableRow>
        </>
      ),
      actions: (
        <>
          <Grid container spacing={1}>
            {user?.services?.password && (
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<EmailIcon />}
                  onClick={() => sendResetPasswordEmail()}
                >
                  Send forgot password email
                </Button>
              </Grid>
            )}
            <Grid item>
              <SetPassword setPassword={setPassword} />
            </Grid>
          </Grid>
        </>
      ),
    },
  ]

  if (member) {
    const component = userInfo.find((obj) => obj.status === member.status)
    return (
      <Grid container spacing={3} alignItems="stretch">
        <Grid item md={12} className={classes.topGrid}>
          <Typography variant="h6">Edit {member.name}'s member</Typography>
        </Grid>
        <Grid item md={6} align="center">
          <div className={classes.leftGrid} style={{ height: '100%' }}>
            <Avatar src={convertAvatar(member?.avatar)} className={classes.avatar} />
            <div className={classes.userInfo}>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className={classes.bold}>Status:</TableCell>
                    <TableCell align="right">
                      {CONSTANTS.USER_STATUS[member?.status]}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={classes.bold}>Created:</TableCell>
                    <TableCell align="right">
                      {DateTime.fromJSDate(member?.createdAt)
                        .setZone('Australia/Sydney')
                        .toLocaleString(DateTime.DATE_SHORT)}
                    </TableCell>
                  </TableRow>
                  {component?.info}
                </TableBody>
              </Table>
            </div>
            <div className={classes.actions}>{component?.actions}</div>
          </div>
        </Grid>
        <Grid item md={6} align="center">
          {user && member && (
            <AutoForm
              schema={userSchema}
              onSubmit={(form) => {
                editUser(form)
              }}
              model={{
                username: user.username,
                roles: user?.roles?.map((roleObj) => roleObj._id),
                ...member,
              }}
            >
              <AutoField name="username" disabled />
              <AutoField name="name" />
              <AutoField name="nickname" />
              <div className={classes.mobile}>
                <AutoField name="mobile" defaultValue={member.mobile} />
              </div>
              <div className={classes.roles}>
                <AutoField name="roles" />
              </div>
              <ErrorsField />
              <Grid container spacing={1}>
                <Grid item md={6}>
                  {member.status === 'active' && (
                    <SuspendAccount suspendMember={suspendMember} name={member.name} />
                  )}
                  {member.status === 'suspended' && (
                    <RestoreAccount
                      setActiveMember={setActiveMember}
                      name={member.name}
                    />
                  )}
                </Grid>
                <Grid item md={6}>
                  <SubmitField variant="contained" color="primary" fullWidth>
                    Save
                  </SubmitField>
                </Grid>
              </Grid>
            </AutoForm>
          )}
        </Grid>
      </Grid>
    )
  }
  return <Typography>User was not found</Typography>
}

EditUser.propTypes = {
  user: PropTypes.object.isRequired,
  member: PropTypes.object.isRequired,
  editUser: PropTypes.func.isRequired,
  setPassword: PropTypes.func.isRequired,
  sendResetPasswordEmail: PropTypes.func.isRequired,
  sendConfirmationEmail: PropTypes.func.isRequired,
  suspendMember: PropTypes.func.isRequired,
  setActiveMember: PropTypes.func.isRequired,
}
