import React, { useState, useEffect, useCallback } from 'react'
import DataDeletionDialog from './delete-dialog'
import {
  Container,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Box,
  Alert,
  Tooltip,
  Checkbox,
  FormControlLabel,
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  InfoOutlined as InfoIcon,
  Close as CloseIcon,
  SettingsAccessibility as PersonIcon,
} from '@mui/icons-material'
import dbg from 'debug'

const debug = dbg('app:smart-peer')
// --- Utility Functions ---

// Generates a random, unique 7-character string.
const generateUniqueId = () => {
  return Math.random().toString(36).substring(2, 9)
}

// Simple Email Validation Regex (a common, well-accepted pattern)
const validateEmail = (email) => {
  const re = /^([\w+._-]+@([\w-]+\.)+[\w-]{2,8})$/g
  return re.test(String(email).toLowerCase())
}

const errorMessages = {
  BOSS: 'You cannot add your supervisor/partner, they have already received a link.',
  PART: 'You cannot add yourself.',
  PEER: 'You have already added that person as a team member.',
  EXEC: 'Your MAP executive consultant is not eligible. Please contact your administrator.',
  WSADM: 'You cannot add the administrator.',
  KOI: 'You have already added that person as a Key Outside Influence.',
}

const hints = {
  ['other-roles']: 'Person has other roles',
  ['data']: 'Person has completed form',
  ['no-data']: 'Person has NOT completed form yet',
}

const shouldShowActionButtons = (person, roles) => {
  const rolesList = Array.isArray(roles) ? roles : [roles]
  if (
    person.status === 'active' &&
    !(rolesList.includes('WSADM') || rolesList.includes('ADM'))
  ) {
    return false
  }
  return true
}

const slugify = (name) => {
  if (!name) return ''
  return name.toLowerCase().trim().replace(/[\s']/g, '-')
}

const MyListItemText = ({ person, type, ix }) => {
  const line1 = `${ix + 1}. ${person.name} `
  let line2 = `${person.email}${person.completed ? ' (Feedback Completed)' : ''}`
  if (type === 'KOI') {
    line2 = `${person.email || ''}${person.phone ? `, ${person.phone}` : ''}${
      person.company ? `, ${person.company}` : ''
    }${person.jobTitle ? `, ${person.jobTitle}` : ''}${
      person.completed ? ' (Feedback Completed)' : ''
    }`
  }
  return (
    <>
      <ListItemText
        primary={line1}
        secondary={line2}
        data-cy={`display-${slugify(person.name)}`}
      />
    </>
  )
}
const KeyPersonnelForm = ({
  formData,
  formList,
  changeModel,
  onSubmit,
  userRoles,
  type = 'KP',
  persons = [],
  history,
}) => {
  const MIN_PERSONNEL_COUNT = type === 'KOI' ? 1 : 3 // Required minimum count
  const RECOMMENDED_COUNT = type === 'KOI' ? 1 : 5 // Recommended minimum count
  const nameInputRef = React.useRef(null)

  const initialPersonnel =
    (type === 'KOI' ? formData?.q5?.personnel : formData?.q10a?.personnel) || []
  initialPersonnel.forEach((p) => {
    if (formList && typeof formList.find === 'function') {
      const item = formList?.find((f) => f.id === p.id)
      if (item) {
        p.impact = item.impact
        p.status = item.status
      }
    }
  })

  console.log({ initialPersonnel })
  const [personnel, setPersonnel] = useState(initialPersonnel)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [company, setCompany] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [editId, setEditId] = useState(null)
  const [error, setError] = useState('')
  const [dialogConfig, setDialogConfig] = useState({
    open: false,
    title: '',
    content: '',
    actions: null,
  })
  const [showHelpAlert, setShowHelpAlert] = useState(true)
  const [isEmailValid, setIsEmailValid] = useState(true)
  const [isDataDeletionDialogOpen, setIsDataDeletionDialogOpen] = useState(false)
  const [personForDataDeletion, setPersonForDataDeletion] = useState(null)
  const [noKoiChecked, setNoKoiChecked] = useState(false)

  const handleCloseDialog = () => {
    setDialogConfig({ open: false, title: '', content: '', actions: null })
  }

  const updatePersonnel = (newPersonnel) => {
    setPersonnel(newPersonnel)
  }
  // Determine if the minimum submission criteria is met
  const isSubmissionReady =
    type === 'KOI'
      ? personnel?.length >= MIN_PERSONNEL_COUNT || noKoiChecked
      : personnel?.length >= MIN_PERSONNEL_COUNT

  const stableChangeModel = useCallback(changeModel, [changeModel])

  // Effect to call changeModel whenever personnel state changes
  useEffect(() => {
    // Merge the personnel list back into the formData structure
    stableChangeModel({ personnel })
  }, [personnel, stableChangeModel])

  // Handler for the "Finish" button
  const handleFinish = () => {
    // Only call onSubmit if the minimum criteria is met (button is enabled)
    if (isSubmissionReady) {
      // Pass the complete model structure to the parent onSubmit function
      changeModel({ personnel })
      onSubmit()
    }
  }

  // Toggle the visibility of the help alert
  const handleToggleHelp = () => {
    setShowHelpAlert((prev) => !prev)
  }

  // Called on email input change to run validation
  const handleEmailChange = (e) => {
    const newEmail = e.target.value
    setEmail(newEmail)
    // Validate the email and update the state
    setIsEmailValid(newEmail === '' || validateEmail(newEmail))
    // Clear the main error if the email becomes valid
    if (isEmailValid && error) {
      setError('')
    }
  }

  // Handle adding or updating a person.
  const handleAddOrUpdate = () => {
    // Stop if the email format is invalid
    if (type === 'KP' && !validateEmail(email)) {
      setIsEmailValid(false)
      setError('Please enter a valid email address.')
      return
    }
    if (type === 'KOI' && email && !validateEmail(email)) {
      setIsEmailValid(false)
      setError('Please enter a valid email address.')
      return
    }

    if (email) {
      const isDuplicate = personnel.some((p) => p.email === email && p.id !== editId)
      if (isDuplicate) {
        setError('This is a duplicate.')
        return
      }
    }

    if (!editId) {
      const restrictedEntry = persons.find(
        (entry) => entry.email === email.toLowerCase().trim()
      )

      if (restrictedEntry) {
        const errorMessage =
          errorMessages[restrictedEntry.role] ||
          'This email address is restricted. ' + restrictedEntry.role
        setError(errorMessage)
        return
      }
    }

    // --- Update logic (remains the same) ---
    if (editId !== null) {
      const updatedPersonnel = personnel.map((p) => {
        if (p.id === editId) {
          const updatedPerson = { ...p, name, email }
          if (type === 'KOI') {
            updatedPerson.phone = phone
            updatedPerson.company = company
            updatedPerson.jobTitle = jobTitle
          }
          return updatedPerson
        }
        return p
      })
      updatePersonnel(updatedPersonnel)
    } else {
      const newPerson = {
        id: generateUniqueId(),
        name,
        email,
        completed: false,
        status: 'new',
      }
      if (type === 'KOI') {
        newPerson.phone = phone
        newPerson.company = company
        newPerson.jobTitle = jobTitle
      }
      updatePersonnel([...personnel, newPerson])
    }

    // Reset form fields and state.
    setName('')
    setEmail('')
    setEditId(null)
    setError('')
    setIsEmailValid(true) // Reset validity state for the next entry
    if (type === 'KOI') {
      setPhone('')
      setCompany('')
      setJobTitle('')
    }
    // Set focus to the name field for the next entry
    if (nameInputRef.current) {
      nameInputRef.current.focus()
    }
  }

  const populateFormFields = (person) => {
    setEditId(person.id)
    setName(person.name)
    setEmail(person.email || '')
    setIsEmailValid(true)
    if (type === 'KOI') {
      setPhone(person.phone || '')
      setCompany(person.company || '')
      setJobTitle(person.jobTitle || '')
    }
  }

  const handleContinueWithDataAction = (action) => {
    const updatedPerson = { ...personForDataDeletion, action }
    const updatedPersonnel = personnel.map((p) =>
      p.id === updatedPerson.id ? updatedPerson : p
    )
    updatePersonnel(updatedPersonnel)
    populateFormFields(updatedPerson)
    setIsDataDeletionDialogOpen(false)
  }

  const handleEdit = (id) => {
    const personToEdit = personnel.find((p) => p.id === id)
    debug({ personToEdit })
    if (!personToEdit) return
    if (personToEdit.status === 'active') {
      let title = 'Warning'
      let content = ''
      let actions = (
        <Button id="dialog-close" data-cy="dialog-close" onClick={handleCloseDialog}>
          Close
        </Button>
      )

      switch (personToEdit.impact) {
        case 'no-data':
          title = 'Edit Person'
          content =
            'This person has no other roles, and has not completed the form. Changing their details will send an email to the new address, with the same code'
          actions = (
            <>
              <Button
                id="dialog-cancel"
                data-cy="dialog-cancel"
                onClick={handleCloseDialog}
              >
                Cancel
              </Button>
              <Button
                id="dialog-edit"
                data-cy="dialog-edit"
                onClick={() => {
                  populateFormFields(personToEdit)
                  handleCloseDialog()
                }}
              >
                Edit
              </Button>
            </>
          )
          setDialogConfig({ open: true, title, content, actions })
          break
        case 'other-roles':
          title = 'Cannot Edit Person'
          content =
            'This person has other roles, and can therefore NOT BE MODIFIED. Should you wish to make changes, please access the user profile.'
          setDialogConfig({ open: true, title, content, actions })
          break
        case 'data':
          setPersonForDataDeletion(personToEdit)
          setIsDataDeletionDialogOpen(true)
          break
        default:
          populateFormFields(personToEdit)
          break
      }
    } else {
      // status is 'new', allow the edit
      populateFormFields(personToEdit)
      window.scrollTo(0, 0)
    }
  }

  const handleDelete = (id) => {
    const personToDelete = personnel.find((p) => p.id === id)
    if (!personToDelete) return

    if (personToDelete.status === 'active') {
      setDialogConfig({
        open: true,
        title: 'Delete Person',
        content: 'This person will no longer be required to provide feedback',
        // 'An email will be sent to this person informing them that they no longer need to provide feedback for the participant.',
        actions: (
          <>
            <Button
              id="dialog-cancel"
              data-cy="dialog-cancel"
              onClick={handleCloseDialog}
            >
              Cancel
            </Button>
            <Button
              id="dialog-delete"
              data-cy="dialog-delete"
              onClick={() => {
                updatePersonnel(personnel.filter((p) => p.id !== id))
                handleCloseDialog()
              }}
            >
              Delete
            </Button>
          </>
        ),
      })
    } else {
      updatePersonnel(personnel.filter((p) => p.id !== id))
    }
  }

  const isUser = (roles, id) => {
    // HACK TO DISABLE FOR NOW
    return false
    const person = formList.find((item) => item.id === id)
    return person && (roles.includes('WSADM') || roles.includes('ADM'))
  }

  const isInteractionDisabled = (person, action) => {
    const roles = Array.isArray(userRoles) ? userRoles : [userRoles]
    if (roles.includes('WSADM') || roles.includes('ADM')) {
      return false
    }
    if (person.status === 'new') {
      return false
    }
    // From here, status is 'active' and user is not admin
    if (action === 'edit') {
      return true // Disable edit for non-admin on active personnel
    }
    if (action === 'delete') {
      return true // Disable delete for non-admin on active personnel
    }
    return true // Should not happen
  }

  const editUser = (id) => {
    const person = formList.find((item) => item.id === id)
    if (person.userId) history.push(`/users/${person.userId}`)
  }

  const isAddButtonDisabled = () => {
    if (type === 'KOI') {
      if (!name) return true
      if (!email && !phone) return true
      if (email && !isEmailValid) return true
      return false
    } else {
      // type is 'KP'
      if (!name || !email || !isEmailValid) return true
      return false
    }
  }

  // --- JSX structure ---
  return (
    <Container fixed maxWidth="sm" sx={{ mt: 4, width: { xs: '100%', sm: 600 } }}>
      <Typography variant="h3" component="h1" gutterBottom>
        {type === 'KP' ? 'Key Personnel' : 'Key Outside Influences'}
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Typography variant="body1" color="text.secondary">
          {type === 'KP'
            ? 'Please provide a list of team members for feedback.'
            : 'Please provide a list of Key Outside Influences for feedback.'}
        </Typography>
        {!showHelpAlert && (
          <Tooltip title="Who can I invite?">
            <IconButton
              size="small"
              onClick={handleToggleHelp}
              sx={{ ml: 1, color: 'text.secondary' }}
            >
              <InfoIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* Conditional Help Alert */}
      {showHelpAlert && (
        <Alert severity="info" sx={{ mb: 1 }} onClose={handleToggleHelp}>
          {type === 'KP' && (
            <Box component="ul" sx={{ m: 0, pl: 2 }}>
              <li>Invite people on your team.</li>
              <li>Don't invite people outside your team.</li>

              <li>
                <b>Don't invite your supervisor/partner.</b>
              </li>
            </Box>
          )}
          {type === 'KOI' && (
            <Box component="ul" sx={{ m: 0, pl: 2 }}>
              <li>Invite people OUTSIDE YOUR ORGANIZATION.</li>
              <li>
                You can invite your suppliers or customers, or people that you look up to.
              </li>
              <li>
                <i>Don't invite your supervisor/partner or your own team members.</i>
              </li>
            </Box>
          )}
        </Alert>
      )}

      {/* Input form for adding/editing a person */}
      <Box
        component="form"
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}
      >
        {!isSubmissionReady && (
          <Typography
            variant="caption"
            color="error"
            name="at-least"
            sx={{ fontSize: '12pt', fontWeight: 'bold' }}
          >
            You must supply at least {MIN_PERSONNEL_COUNT} name
            {MIN_PERSONNEL_COUNT > 1 ? 's' : ''} to finish.
          </Typography>
        )}
        {isSubmissionReady && (
          <span data-cy="go-ahead" style={{ color: 'white' }}>
            ok.
          </span>
        )}
        <TextField
          name="name"
          id="name"
          data-cy="name"
          label="Name"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          inputRef={nameInputRef}
        />
        <TextField
          name="email"
          id="email"
          data-cy="email"
          label="Email"
          type="email"
          variant="outlined"
          value={email}
          // Use the new email change handler
          onChange={handleEmailChange}
          fullWidth
          // MUI error props for validation feedback
          error={!isEmailValid}
          helperText={!isEmailValid && 'Invalid email format.'}
        />
        {type === 'KOI' && (
          <>
            <TextField
              name="phone"
              data-cy="phone"
              label="Phone Number"
              variant="outlined"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              fullWidth
            />
            <TextField
              name="company"
              id="company"
              data-cy="company"
              label="Company"
              variant="outlined"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              fullWidth
            />
            <TextField
              name="job-title"
              id="job-title"
              data-cy="job-title"
              label="Job Title"
              variant="outlined"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              fullWidth
            />
          </>
        )}
        {/* Displays specific form errors (restricted/duplicate) */}
        {error && (
          <Alert severity="error" data-cy="error-message">
            {error}
          </Alert>
        )}
        <Button
          id="add-update"
          data-cy="add-update"
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddOrUpdate}
          disabled={isAddButtonDisabled()}
        >
          {editId !== null ? 'Update Person' : 'Add Person'}
        </Button>
      </Box>

      {/* List of personnel */}
      <List dense>
        {personnel.map((person, ix) => (
          <ListItem key={person.id} divider>
            <MyListItemText person={person} userRoles={userRoles} type={type} ix={ix} />
            <ListItemSecondaryAction>
              {shouldShowActionButtons(person, userRoles) && (
                <>
                  <Tooltip
                    title={
                      isInteractionDisabled(person, 'edit')
                        ? 'This person has other roles and cannot be modified here.'
                        : hints[person.impact] || `Impact: ${person.impact || 'none'}`
                    }
                  >
                    <IconButton
                      edge="end"
                      aria-label="edit"
                      onClick={() => handleEdit(person.id)}
                      disabled={isInteractionDisabled(person, 'edit')}
                      data-cy={'edit-' + slugify(person.name)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip
                    title={
                      isInteractionDisabled(person, 'delete')
                        ? 'Cannot delete once they have been invited.'
                        : ''
                    }
                  >
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDelete(person.id)}
                      disabled={isInteractionDisabled(person, 'delete')}
                      data-cy={'rm-' + slugify(person.name)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </>
              )}
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      {/* Submission Section */}
      <Box
        sx={{
          mt: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
        }}
      >
        {personnel.some((p) => p.status === 'active') &&
          !(
            (Array.isArray(userRoles) ? userRoles : [userRoles]).includes('WSADM') ||
            (Array.isArray(userRoles) ? userRoles : [userRoles]).includes('ADM')
          ) && (
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
              You can still add more names if you like.
              <br />
              <br />
              Please contact the administrator to edit/modify previously submitted
              entries.
            </Typography>
          )}
        {type === 'KOI' && (
          <FormControlLabel
            control={
              <Checkbox
                checked={noKoiChecked}
                onChange={(e) => setNoKoiChecked(e.target.checked)}
                name="noKoi"
                data-cy="no-koi-checkbox"
              />
            }
            label="I don't have any Key Outside Influences"
          />
        )}
        {personnel.length < RECOMMENDED_COUNT && isSubmissionReady && !noKoiChecked && (
          <Alert
            severity="warning"
            sx={{ mb: 1, width: '100%' }}
            data-cy="soft-limit-alert"
          >
            We would prefer you to provide at least {RECOMMENDED_COUNT} names
          </Alert>
        )}
        <Button
          id="finish"
          data-cy="finish"
          variant="contained"
          color="primary"
          style={isSubmissionReady ? { background: 'green' } : {}}
          size="large"
          onClick={handleFinish}
          disabled={!isSubmissionReady}
          fullWidth
        >
          Finish
        </Button>
      </Box>

      {/* Generic Dialog for warnings and confirmations */}
      <Dialog open={dialogConfig.open} onClose={handleCloseDialog}>
        <DialogTitle>{dialogConfig.title}</DialogTitle>
        <DialogContent>{dialogConfig.content}</DialogContent>
        <DialogActions>{dialogConfig.actions}</DialogActions>
      </Dialog>
      {isDataDeletionDialogOpen && (
        <DataDeletionDialog
          open={isDataDeletionDialogOpen}
          onClose={() => setIsDataDeletionDialogOpen(false)}
          onContinue={handleContinueWithDataAction}
          type={type}
        />
      )}
    </Container>
  )
}

export default KeyPersonnelForm
