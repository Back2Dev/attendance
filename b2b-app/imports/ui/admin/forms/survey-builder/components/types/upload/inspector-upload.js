import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useRecoilState } from 'recoil'
import { isPlainObject } from 'lodash'
import { editInspectorState } from '$sb/recoil/atoms'
import debug from 'debug'
import { JSONSchemaBridge } from 'uniforms-bridge-json-schema';
import { AutoForm, RadioField, AutoField, SelectField, SubmitField, ErrorsField } from 'uniforms-material';
import Ajv from 'ajv';
import addFormats from 'ajv-formats'

import SimpleSchema from 'simpl-schema'
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2'

import {
    Button,
    Checkbox,
    FormGroup,
    TextField,
    Box,
    FormLabel,
    FormControl,
    RadioGroup,
    Radio,
    FormControlLabel,
  } from '@material-ui/core'

const log = debug('builder:edit-upload-property')

const initialProperty = {fileType:'single', maxSize:100, accept:{'.pdf': true, 'image/*': true, '.txt': true, 'video/*': false}}

const EditProperty = ({ pid, path, relabel }) => {
  // TODO convert into recoil hook
  const [property=initialProperty, setProperty] = useRecoilState(editInspectorState({ pid, path }))
  console.log(property)

//when value change...do something like compiling...save value to +val // and set to property as well ??

//the setting and file rules need implement to drap zone

//whenever file is dropped, upload to S3 and add the URL to +val


// const onSubmit = (e) => {
//     e.preventDefault()
   
// }

const onChange = (value) => {
 
    // setValue(value)
    setProperty(value)
}

    return (
        <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { m: 1, width: '25ch' },
        }}
        noValidate
        autoComplete="off"
      >
        <FormControl>
        <FormLabel id="fileType">File Type</FormLabel>
        <RadioGroup
        row
          aria-labelledby="fileType"
          name="controlled-radio-buttons-group"
          value={property.fileType}
          onChange={(e)=>onChange({...property, fileType: e.target.value})}
        >
          <FormControlLabel value={false} control={<Radio />} label="Single" />
          <FormControlLabel value={true} control={<Radio />} label="Multiple" />
        </RadioGroup>
      </FormControl>

        <TextField
        id="MaxSize"
        label="MaxSize"
        type="number"
        value={property.maxSize} 
        onChange={(e)=>onChange({...property, maxSize: e.target.value})}
        />

    <FormGroup>
      <FormControlLabel control={<Checkbox checked={property.accept['.pdf']}  onChange={(e)=>onChange({...property, accept:{...property.accept,'.pdf': e.target.checked} })} />} label="PDF" />
      <FormControlLabel   control={<Checkbox checked={property.accept['image/*']} onChange={(e)=>onChange({...property, accept:{...property.accept,'image/*': e.target.checked} })}  />} label="IMG" />
      <FormControlLabel  control={<Checkbox checked={property.accept['.txt']}  onChange={(e)=>onChange({...property, accept:{...property.accept,'.txt': e.target.checked} })}  />} label="TEXT" />
      <FormControlLabel  control={<Checkbox checked={property.accept['video/*']}  onChange={(e)=>onChange({...property,  accept:{...property.accept,'video/*': e.target.checked} })}  />} label="VIDEO" />
    </FormGroup>


    {/* <Button variant="contained" onClick={onSubmit}>Submit</Button> */}
      </Box>
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


