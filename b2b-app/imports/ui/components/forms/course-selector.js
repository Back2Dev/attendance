import { Meteor } from 'meteor/meteor'
import React from 'react'
import PropTypes from 'prop-types'
import { connectField } from 'uniforms'
import { TextField } from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import styled from 'styled-components'
import { useTracker } from 'meteor/react-meteor-data'
import Courses from '/imports/api/courses/schema.js'
import { CourseItemSchema } from '/imports/api/events/schema.js'

const StyledCoursesSelector = styled.div`
  margin: 10px 0;
`

const CoursesSelector = ({ className, disabled, onChange, value, label }) => {
  // console.log({ value })
  // console.log(name, label)

  const { loading, items } = useTracker(() => {
    const sub = Meteor.subscribe('all.courses')
    return {
      loading: !sub.ready(),
      items: Courses.find({})
        .fetch()
        .map((course) => CourseItemSchema.clean(course)),
    }
  }, [])

  const renderList = () => {
    if (loading) {
      return null
    }
    // console.log(items)
    const selectedItem = items.find((item) => item._id === value)

    return (
      <Autocomplete
        options={items}
        getOptionLabel={(option) => `${option.title}/${option.difficulty}`}
        getOptionSelected={(option, value) => option._id === value?._id}
        value={selectedItem || null}
        filterSelectedOptions
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            label={label || 'Course'}
            placeholder="Select courses"
          />
        )}
        disabled={disabled}
        onChange={(e, value) => onChange(value?._id)}
      />
    )
  }

  return <StyledCoursesSelector>{renderList()}</StyledCoursesSelector>
}

CoursesSelector.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
  disabled: PropTypes.bool,
  label: PropTypes.string,
}

const CoursesField = connectField(CoursesSelector)

export default CoursesField
