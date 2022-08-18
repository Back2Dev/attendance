import React from 'react'
import PropTypes from 'prop-types'
import { useFormik } from 'formik'
import { Grid, TextField, MenuItem, Button } from '@material-ui/core'

export default function InsertForm({ insert, handleClose }) {
  const onSubmit = async (values, { resetForm }) => {
    try {
      await insert(values)
      resetForm({})
      handleClose()
    } catch (e) {
      console.error(e.message)
    }
  }

  const formik = useFormik({
    initialValues: {
      name: '',
      slug: '',
      approvalRequired: false,
    },
    onSubmit: onSubmit,
  })

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={2}>
        <Grid item sm={12}>
          <TextField
            required
            size="small"
            variant="outlined"
            id="doctype-name"
            name="name"
            label="Name"
            value={formik.values.name}
            onChange={formik.handleChange}
            fullWidth
          />
        </Grid>
        <Grid item sm={12}>
          <TextField
            required
            size="small"
            variant="outlined"
            id="doctype-slug"
            name="slug"
            label="Slug"
            value={formik.values.slug}
            onChange={formik.handleChange}
            fullWidth
          />
        </Grid>
        <Grid item sm={12}>
          <TextField
            id="active"
            size="small"
            variant="outlined"
            name="active"
            select
            fullWidth
            value={formik.values.approvalRequired}
            onChange={formik.handleChange}
            label="Active"
          >
            {[
              { label: 'Yes', value: true },
              { label: 'No', value: false },
            ].map((option) => (
              <MenuItem key={option.label} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item sm={12} container justifyContent="flex-end">
          <Button
            disabled={!formik.dirty}
            variant="contained"
            type="submit"
            color="primary"
            data-cy="add-new-doctype"
          >
            Add
          </Button>
        </Grid>
      </Grid>
    </form>
  )
}

InsertForm.propTypes = {
  insert: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
}
