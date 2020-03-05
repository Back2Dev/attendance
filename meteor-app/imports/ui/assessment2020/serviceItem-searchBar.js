import React, { useContext } from 'react'
import { ServiceContext } from './service-context'
import PropTypes from 'prop-types'
import { Search, Grid, Header, Segment, Label } from 'semantic-ui-react'
import _ from 'lodash'

const resultRenderer = ({ title }) => <Label content={title} />

resultRenderer.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string
}

const SearchBar = props => {
  const [state, setState] = useContext(ServiceContext)

  const [isLoading, setIsLoading] = React.useState(false)
  const [results, setResults] = React.useState([])
  const [value, setValue] = React.useState('')

  // update this method to display tags instead of setting it on the search bar
  const handleResultSelect = (e, { result }) => {
    const newTags = [...state.tags, result]
    const newState = { ...state, tags: newTags }
    setState(newState)
    setValue('')
  }

  const handleSearchChange = (e, { value }) => {
    setIsLoading(true)
    setValue(value)

    setTimeout(() => {
      if (value.length < 1) {
        setIsLoading(false)
        setResults([])
        setValue('')
      }

      const re = new RegExp(_.escapeRegExp(value), 'i')
      const isMatch = result => re.test(result.title)
      setIsLoading(false)
      setResults(_.filter(state.data, isMatch))
    }, 300)
  }

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
