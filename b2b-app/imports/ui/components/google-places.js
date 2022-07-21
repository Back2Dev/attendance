import React from 'react'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import LocationOnIcon from '@material-ui/icons/LocationOn'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import parse from 'autosuggest-highlight/parse'
import throttle from 'lodash/throttle'
import { connectField } from 'uniforms'

function loadScript(src, position, id) {
  if (!position) {
    return
  }

  const script = document.createElement('script')
  script.setAttribute('async', '')
  script.setAttribute('id', id)
  script.src = src
  position.appendChild(script)
}

const autocompleteService = { current: null }

const useStyles = makeStyles((theme) => ({
  icon: {
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(2),
  },
}))

// the autcompleteBugFix prop is a boolean that changes the behaviour of the autocomplete text field,
// it tries to fix the bug of google chrome auto filling and covering place addresses
function GoogleMaps({
  onChange,
  error,
  defaultValue,
  value,
  label,
  autocompleteBugFix,
  name,
  required,
  helperText,
}) {
  const classes = useStyles()
  const [val, setVal] = React.useState(defaultValue || value)
  const [inputValue, setInputValue] = React.useState('')
  const [options, setOptions] = React.useState([])
  const loaded = React.useRef(false)
  if (typeof window !== 'undefined' && !loaded.current) {
    if (!document.querySelector('#google-maps')) {
      loadScript(
        'https://maps.googleapis.com/maps/api/js?key=AIzaSyBzYpKU5CRrsB9MLSZxZNlBMNfcHcjJ574&libraries=places',
        document.querySelector('head'),
        'google-maps'
      )
    }

    loaded.current = true
  }

  const fetch = React.useMemo(
    () =>
      throttle((request, callback) => {
        request.componentRestrictions = { country: 'au' }
        autocompleteService.current.getPlacePredictions(request, callback)
      }, 200),
    []
  )

  React.useEffect(() => {
    let active = true

    if (!autocompleteService.current && window.google) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService()
    }
    if (!autocompleteService.current) {
      return undefined
    }

    if (inputValue === '') {
      setOptions(val ? [val] : [])
      return undefined
    }

    fetch({ input: inputValue }, (results) => {
      if (active) {
        let newOptions = []

        if (val) {
          newOptions = [val]
        }

        if (results) {
          newOptions = [...newOptions, ...results]
        }

        setOptions(newOptions)
      }
    })

    return () => {
      active = false
    }
  }, [val, inputValue, fetch])

  return (
    <Autocomplete
      id="google-places-search"
      getOptionLabel={(option) =>
        typeof option === 'string' ? option : option.description
      }
      filterOptions={(x) => x}
      options={options}
      autoComplete
      includeInputInList
      filterSelectedOptions
      defaultValue={val || ''}
      onChange={(event, newValue) => {
        setOptions(newValue ? [newValue, ...options] : options)
        setVal(newValue)
        onChange(newValue && newValue.description)
      }}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue)
        onChange(newInputValue)
      }}
      freeSolo
      renderInput={(params) => {
        return (
          <TextField
            {...params}
            margin="dense"
            required={required}
            name={name}
            label={label || 'Property address'}
            error={error != null}
            variant="outlined"
            inputProps={
              autocompleteBugFix
                ? {
                    ...params.inputProps,
                    autoComplete: 'new-password',
                  }
                : {
                    ...params.inputProps,
                  }
            }
            fullWidth
            helperText={helperText}
          />
        )
      }}
      renderOption={(option) => {
        const matches = option.structured_formatting.main_text_matched_substrings
        const parts = parse(
          option.structured_formatting.main_text,
          matches.map((match) => [match.offset, match.offset + match.length])
        )

        return (
          <Grid container alignItems="center">
            <Grid item>
              <LocationOnIcon className={classes.icon} />
            </Grid>
            <Grid item xs>
              {parts.map((part, index) => (
                <span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }}>
                  {part.text}
                </span>
              ))}
              <Typography variant="body2" color="textSecondary">
                {option.structured_formatting.secondary_text}
              </Typography>
            </Grid>
          </Grid>
        )
      }}
    />
  )
}

export default connectField(GoogleMaps)
