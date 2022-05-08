import React, { useEffect, Fragment } from 'react'
import PropTypes from 'prop-types'
import { useRecoilState } from 'recoil'
import { editInspectorState } from '/imports/ui/forms/survey-builder/recoil/atoms'
import debug from 'debug'
import { Checkbox, FormGroup, TextField, FormControlLabel } from '@material-ui/core'

const log = debug('builder:edit-upload-property')

const initialProperty = {
  maxFiles: 1,
  maxSize: 100,
  accept: { '.pdf': true, 'image/*': true, '.txt': true, 'video/*': false },
}

const EditProperty = ({ pid, path }) => {
  // TODO convert into recoil hook
  const [property, setProperty] = useRecoilState(editInspectorState({ pid, path }))

  useEffect(() => {
    if (property) {
      return
    }

    setProperty(initialProperty)
  }, [property])

  const onChange = (value) => {
    setProperty(value)
  }

  return (
    <>
      {property && (
        <Fragment>
          <TextField
            id="maxFiles"
            label="MaxFiles"
            type="number"
            variant="outlined"
            style={{ marginBottom: '0.5em', marginTop: '0.5rem' }}
            value={property?.maxFiles}
            onChange={(e) => onChange({ ...property, maxFiles: e.target.value })}
          />

          <TextField
            id="MaxSize"
            label="MaxSize"
            type="number"
            variant="outlined"
            style={{ marginBottom: '0.5rem', marginTop: '0.5rem' }}
            value={property?.maxSize}
            onChange={(e) => onChange({ ...property, maxSize: e.target.value })}
          />

          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={property?.accept?.['.pdf']}
                  onChange={(e) =>
                    onChange({
                      ...property,
                      accept: { ...property?.accept, '.pdf': e.target.checked },
                    })
                  }
                />
              }
              label="PDF"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={property?.accept?.['image/*']}
                  onChange={(e) =>
                    onChange({
                      ...property,
                      accept: { ...property?.accept, 'image/*': e.target.checked },
                    })
                  }
                />
              }
              label="IMG"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={property?.accept?.['.txt']}
                  onChange={(e) =>
                    onChange({
                      ...property,
                      accept: { ...property?.accept, '.txt': e.target.checked },
                    })
                  }
                />
              }
              label="TEXT"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={property?.accept?.['video/*']}
                  onChange={(e) =>
                    onChange({
                      ...property,
                      accept: { ...property?.accept, 'video/*': e.target.checked },
                    })
                  }
                />
              }
              label="VIDEO"
            />
          </FormGroup>
        </Fragment>
      )}
    </>
  )
}

EditProperty.propTypes = {
  /** part instance id */
  pid: PropTypes.string.isRequired,
  /** path of state. can be a key to a string, object or array of objects */
  path: PropTypes.string,
  /** optional. allows renaming labels from internal paths to some other string */
  relabel: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
}

export { EditProperty }
