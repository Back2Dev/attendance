import React, { useState } from 'react'
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  createTheme,
  ThemeProvider,
  CssBaseline,
} from '@mui/material'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'

const geminiRequest = `
Can you please code a 3 page webform for me in React and Material UI. The purpose of the form is to collect information about a persons management strengths and opportunities.

Page 1 should ask the following questions:

Page 1


Question 1 (written response)

1. What are your main leadership/management strengths as a manager?


Question 2 (radio button response). There are 6 possible responses below. Please put these in a table, which the radio button and the word in all caps in the first cell, and the explanatory text in a cell next to it on the same row. Each option should appear in a separate row.

2. Every leader/manager has opportunities for growth and improvement. What would you consider to be your Primary Function of Management Opportunity?

COMMUNICATING. This may include areas such as frequency, style, effectiveness, internal or external communications, appropriate use of email, speaking one on one, speaking in large groups, writing skills, listening skills, relating, etc.

PLANNING. This may include areas such as no formal planning, project planning, structured problem-solving, reactive vs. proactive, for seeing problems and opportunities, developing strategies, etc.

STAFFING. This may include areas such as providing professional development for staff, interviewing skills, effective onboarding of new team members, recognition of exceptional performance, retaining people, etc.

ORGANIZING. This may include areas such as personal organization, availability of resources (people, time, financial, equipment, supplies), eliminating bottlenecks, time management, organizational structure, allocation of resources, coordinating the work of others, sorting the vital from the less important, delegation, etc.

CONTROLLING. This may include areas such as self-accountability, cost and inventory control, productivity, quality, customer service, setting expectations, assessing performance, follow through, holding people accountable, taking corrective action, etc.\

LEADING. This may include areas such as innovation, motivating staff and teams, empowering staff, morale-building, clear vision, shows confidence, develops trust, excellent coach and mentor, inspires continuous improvement, demonstrates passion, confronts difficult issues, demonstrates empathy, encourages excellence, embraces change, etc.


Question 3 (written response)

3. Please provide specific, candid feedback as to why.



Page 2


Question 4 (radio button response). The radio buttons avsilable should be the as for question 2 on page 1, except the response selected in question 2 should not be available for this question.

4. What would you consider to be your SECONDARY Function of Management Opportunity?


Question 5 (written response)

5. Please provide specific, candid feedback as to why.


Question 6 (written response)

4. ANY ADDITIONAL COMMENTS?



Page 3


Question 7 (written response)

1. Any additional comments? 
`
// --- MUI Theme ---
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f4f6f8',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h5: {
      fontWeight: 600,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
        },
      },
    },
  },
})

// --- Data for the form ---
const managementFunctions = {
  COMMUNICATING:
    'This may include areas such as frequency, style, effectiveness, internal or external communications, appropriate use of email, speaking one on one, speaking in large groups, writing skills, listening skills, relating, etc.',
  PLANNING:
    'This may include areas such as no formal planning, project planning, structured problem-solving, reactive vs. proactive, for seeing problems and opportunities, developing strategies, etc.',
  STAFFING:
    'This may include areas such as providing professional development for staff, interviewing skills, effective onboarding of new team members, recognition of exceptional performance, retaining people, etc.',
  ORGANIZING:
    'This may include areas such as personal organization, availability of resources (people, time, financial, equipment, supplies), eliminating bottlenecks, time management, organizational structure, allocation of resources, coordinating the work of others, sorting the vital from the less important, delegation, etc.',
  CONTROLLING:
    'This may include areas such as self-accountability, cost and inventory control, productivity, quality, customer service, setting expectations, assessing performance, follow through, holding people accountable, taking corrective action, etc.',
  LEADING:
    'This may include areas such as innovation, motivating staff and teams, empowering staff, morale-building, clear vision, shows confidence, develops trust, excellent coach and mentor, inspires continuous improvement, demonstrates passion, confronts difficult issues, demonstrates empathy, encourages excellence, embraces change, etc.',
}

const functionKeys = Object.keys(managementFunctions)

// --- Reusable Components ---
const FormPage = ({ title, children }) => (
  <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: '900px' }}>
    <Typography variant="h5" component="h2" gutterBottom align="center" sx={{ mb: 4 }}>
      {title}
    </Typography>
    {children}
  </Paper>
)

const WrittenResponse = ({ id, label, value, onChange, placeholder }) => (
  <Box mb={4}>
    <FormControl fullWidth>
      <Typography
        variant="h6"
        component="label"
        htmlFor={id}
        sx={{ mb: 1, fontWeight: 'medium' }}
      >
        {label}
      </Typography>
      <TextField
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        multiline
        rows={4}
        variant="outlined"
        fullWidth
        name={id}
      />
    </FormControl>
  </Box>
)

const RadioResponseTable = ({ question, name, options, selectedFunction, onChange }) => (
  <Box mb={4}>
    <FormControl component="fieldset" fullWidth>
      <Typography variant="h6" component="legend" sx={{ mb: 2, fontWeight: 'medium' }}>
        {question}
      </Typography>
      <RadioGroup
        aria-label={question}
        name={name}
        value={selectedFunction}
        onChange={(e) => onChange(e.target.value)}
      >
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead sx={{ bgcolor: 'grey.100' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Function</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {options.map((key) => (
                <TableRow key={key} hover selected={selectedFunction === key}>
                  <TableCell sx={{ width: '30%', verticalAlign: 'top' }}>
                    <FormControlLabel
                      value={key}
                      control={<Radio />}
                      label={<Typography sx={{ fontWeight: 'bold' }}>{key}</Typography>}
                    />
                  </TableCell>
                  <TableCell sx={{ verticalAlign: 'top' }}>
                    {managementFunctions[key]}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </RadioGroup>
    </FormControl>
  </Box>
)

const NavigationButtons = ({ page, setPage, isNextDisabled, surveyType }) => (
  <Box display="flex" justifyContent="space-between" mt={4}>
    <Button variant="outlined" onClick={() => setPage(page - 1)} disabled={page === 1}>
      Previous
    </Button>
    <Button
      variant="contained"
      onClick={() => setPage(page + 1)}
      disabled={isNextDisabled}
      data-cy={'next-step'}
    >
      Next
    </Button>
  </Box>
)

// --- Main A2Form Component ---
export default function A2Form({ formData, onSubmit, changeModel, surveyType = 'q1' }) {
  const [page, setPage] = useState(1)
  const [model, setModel] = useState(
    formData?.primary || {
      strengths: '',
      primaryOpportunity: '',
      primaryFeedback: '',
      secondaryOpportunity: '',
      secondaryFeedback: '',
      additionalComments: '',
    }
  )
  const [isSubmitted, setIsSubmitted] = useState(false)

  React.useEffect(() => {
    window.scrollTo(0, 0)
  }, [page, isSubmitted])

  const handleChange = (field) => (e) => {
    const newModel = { ...model, [field]: e.target.value }
    setModel(newModel)
    changeModel && changeModel(newModel)
  }

  const handleRadioChange = (field, value) => {
    let newModel
    if (field === 'primaryOpportunity' && value === model.secondaryOpportunity) {
      newModel = { ...model, [field]: value, secondaryOpportunity: '' }
    } else {
      newModel = { ...model, [field]: value }
    }
    setModel(newModel)
    changeModel && changeModel(newModel)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    changeModel && changeModel(model)
    onSubmit && onSubmit()
  }

  const getQuestionLabel = (baseLabel, includeNameInterpolation = false) => {
    if (surveyType !== 'q1' && includeNameInterpolation && formData?.name) {
      return baseLabel.replace(/your/g, `${formData.name}'s`)
      // .replace(/you/g, formData.name)
    }
    return baseLabel
  }

  const renderPage = () => {
    switch (page) {
      case 1:
        return (
          <FormPage title="Management Strengths & Opportunities">
            <WrittenResponse
              id="strengths"
              label={getQuestionLabel(
                '1. What are your main leadership/management strengths as a manager?',
                true
              )}
              value={model.strengths}
              onChange={handleChange('strengths')}
              placeholder="Describe your key strengths..."
            />
            <RadioResponseTable
              question={getQuestionLabel(
                '2. Every leader/manager has opportunities for growth and improvement. What would you consider to be your Primary Function of Management Opportunity?',
                true
              )}
              name="primaryOpportunity"
              options={functionKeys}
              selectedFunction={model?.primaryOpportunity}
              onChange={(value) => handleRadioChange('primaryOpportunity', value)}
            />
            <WrittenResponse
              id="primaryFeedback"
              label="3. Please provide specific, candid feedback as to why."
              value={model?.primaryFeedback}
              onChange={handleChange('primaryFeedback')}
              placeholder="Explain your choice for the primary opportunity..."
            />
            <NavigationButtons
              page={page}
              setPage={setPage}
              isNextDisabled={
                !model?.primaryOpportunity || !model?.strengths || !model?.primaryFeedback
              }
              surveyType={surveyType}
            />
          </FormPage>
        )
      case 2:
        const secondaryFunctions = functionKeys.filter(
          (key) => key !== model?.primaryOpportunity
        )
        return (
          <FormPage title="Management Strengths & Opportunities">
            <RadioResponseTable
              question={getQuestionLabel(
                '4. What would you consider to be your SECONDARY Function of Management Opportunity?',
                true
              )}
              name="secondaryOpportunity"
              options={secondaryFunctions}
              selectedFunction={model?.secondaryOpportunity}
              onChange={(value) => handleRadioChange('secondaryOpportunity', value)}
            />
            <WrittenResponse
              id="secondaryFeedback"
              label="5. Please provide specific, candid feedback as to why."
              value={model?.secondaryFeedback}
              onChange={handleChange('secondaryFeedback')}
              placeholder="Explain your choice for the secondary opportunity..."
            />
            <NavigationButtons
              page={page}
              setPage={setPage}
              isNextDisabled={!model?.secondaryOpportunity || !model?.secondaryFeedback}
            />
          </FormPage>
        )
      case 3:
        return (
          <FormPage title="Management Strengths & Opportunities">
            <WrittenResponse
              id="additionalComments"
              label="6. Any additional comments?"
              value={model?.additionalComments}
              onChange={handleChange('additionalComments')}
              placeholder="Any other thoughts or comments..."
            />
            <Box display="flex" justifyContent="space-between" mt={4}>
              <Button variant="outlined" onClick={() => setPage(page - 1)}>
                Previous
              </Button>
              <Button
                data-cy="finish-btn"
                variant="contained"
                color="success"
                onClick={handleSubmit}
                disabled={!model?.additionalComments} // Need to fill in comments
              >
                Next
              </Button>
            </Box>
          </FormPage>
        )
      default:
        return null
    }
  }

  if (isSubmitted) {
    return (
      <Container>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="100vh"
          textAlign="center"
        >
          <Paper elevation={3} sx={{ p: 5 }}>
            <CheckCircleOutlineIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h4" gutterBottom>
              Thank You!
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
              Your response has been submitted successfully.
            </Typography>
            <Button
              variant="contained"
              onClick={() => {
                onSubmit && onSubmit(model)
              }}
            >
              Return to Forms
            </Button>
          </Paper>
        </Box>
      </Container>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          minHeight="100vh"
          py={4}
        >
          {renderPage()}
        </Box>
      </Container>
    </ThemeProvider>
  )
}
