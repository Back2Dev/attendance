import React from 'react'
import PropTypes from 'prop-types'
import { Search, Label } from 'semantic-ui-react'
import _ from 'lodash'

const resultRenderer = ({ name }) => <Label content={name} />

resultRenderer.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string
}

const SearchBar = props => {
  const { handleResultSelect, handleSearchChange, isLoading, results, value } = props
  return (
    <Search
      loading={isLoading}
      onResultSelect={handleResultSelect}
      onSearchChange={_.debounce(handleSearchChange, 500, {
        leading: true
      })}
      results={results}
      value={value}
      resultRenderer={resultRenderer}
    />
  )
}

export default SearchBar
