import React, { useContext } from 'react'
import SearchBar from './service-item-search'
import { ServiceContext } from './service-context'
import _ from 'lodash'

export default function ServiceItemSearchContainer() {
  const [state, setState] = useContext(ServiceContext)

  console.log('state =', state)

  const [isLoading, setIsLoading] = React.useState(false)
  const [results, setResults] = React.useState([])
  const [value, setValue] = React.useState('')

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
      const isMatch = result => re.test(result.name)
      setIsLoading(false)
      setResults(_.filter(state.data, isMatch))
    }, 300)
  }

  return (
    <SearchBar
      handleResultSelect={handleResultSelect}
      handleSearchChange={handleSearchChange}
      isLoading={isLoading}
      results={results}
      value={value}
    />
  )
}
