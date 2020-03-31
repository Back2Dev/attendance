import React, { useContext } from 'react'
import _ from 'lodash'
import { Search } from 'semantic-ui-react'
import { ServiceContext } from './service-context'

const ItemSearch = () => {
  const [state, setState] = useContext(ServiceContext)

  const [isLoading, setIsLoading] = React.useState(false)
  const [results, setResults] = React.useState([])
  const [value, setValue] = React.useState('')

  const handleResultSelect = (e, { result }) => {
    const item = { ...result }

    const newState = { ...state, tags: [...state.tags, item] }
    console.log('newState = ', newState)
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
      setResults(_.filter(state.serviceItems, isMatch))
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
    />
  )
}

ItemSearch.propTypes = {}

export default ItemSearch
