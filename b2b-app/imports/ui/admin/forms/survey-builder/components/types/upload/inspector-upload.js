import React, { useEffect, Fragment } from 'react'
import PropTypes from 'prop-types'
import { useRecoilState } from 'recoil'
import { editInspectorState } from '$sb/recoil/atoms'
import debug from 'debug'
import {
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
import SimpleSchema from 'simpl-schema'
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2'
import { AutoForm, SelectField, BoolField, AutoField } from 'uniforms-material'

const log = debug('builder:edit-upload-property')

// const uploadSchema = new SimpleSchema({
//   multiple: {
//     type: Boolean,
//     defaultValue: false,
//     uniforms: {
//       label:"Multiple Files",
//       component: BoolField,
//       appearance:"Toggle"
    
//     },
    
//   },
//   maxSize: {
//     type: SimpleSchema.Integer,
//     min:0
//   },
//   accept: {
//     type: Array,

//   },
//   "accept.$":{
//     type: String,
//     allowedValues: ['.pdf', "image/*", '.txt', 'video/*'],
//   },
//   optional: {
//     type: Boolean,
//     defaultValue: false
//   },

// })

// const schema2Bridge = new SimpleSchema2Bridge(uploadSchema)



const initialProperty = {multiple:'false', maxSize:100, accept:{'.pdf': true, 'image/*': true, '.txt': true, 'video/*': false}}

const EditProperty = ({ pid, path }) => {
  // TODO convert into recoil hook
  const [property, setProperty] = useRecoilState(editInspectorState({ pid, path }))

  useEffect(()=>{
    if(property){
      return
    }

    setProperty(initialProperty)

  },[property])

const onChange = (value) => {
    setProperty(value)
}

// const onSubmit = (v) => {
//   console.log(v)
// }

    return (
    //   <AutoForm
    //   schema={schema2Bridge}
    //   // model={item}
    //   onSubmit={onSubmit}
    //   // autoField={CustomAutoField}
    // />

  
  
        <Box
        component="form"
        sx={{
          // '& .MuiTextField-root': { m: 1, width: '25ch' }
        }}
        noValidate
        autoComplete="off"
      >
        {property &&
          <Fragment>
          <FormControl>
        {/* <FormLabel id="multiple">File Type</FormLabel> */}
        <RadioGroup
          row
          aria-labelledby="multiple"
          name="controlled-radio-buttons-group"
          value={property.multiple}
          onChange={(e)=>
            onChange({...property, multiple: e.target.value})}
        >
          <FormControlLabel value={"false"} control={<Radio />} label="Single" />
          <FormControlLabel value={"true"} control={<Radio />} label="Multiple" />
        </RadioGroup>
      </FormControl>

        <TextField
        id="MaxSize"
        label="MaxSize"
        type="number"
        value={property?.maxSize} 
        onChange={(e)=>onChange({...property, maxSize: e.target.value})}
        />

    <FormGroup>
      <FormControlLabel control={<Checkbox checked={property?.accept?.['.pdf']}  onChange={(e)=>onChange({...property, accept:{...property?.accept,'.pdf': e.target.checked} })} />} label="PDF" />
      <FormControlLabel   control={<Checkbox checked={property?.accept?.['image/*']} onChange={(e)=>onChange({...property, accept:{...property?.accept,'image/*': e.target.checked} })}  />} label="IMG" />
      <FormControlLabel  control={<Checkbox checked={property?.accept?.['.txt']}  onChange={(e)=>onChange({...property, accept:{...property?.accept,'.txt': e.target.checked} })}  />} label="TEXT" />
      <FormControlLabel  control={<Checkbox checked={property?.accept?.['video/*']}  onChange={(e)=>onChange({...property,  accept:{...property?.accept,'video/*': e.target.checked} })}  />} label="VIDEO" />
    </FormGroup>
    </Fragment>
    }

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


