import React, { useContext, useState, useEffect } from 'react'
import _, { cloneDeep } from 'lodash'
import { Search } from 'semantic-ui-react'
import { ServiceContext } from './service-context'

const ItemSearch = () => {
  const [state, setState] = useContext(ServiceContext)
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState([])
  const [value, setValue] = useState('')
  const { tags } = state
  let totalCost = state.totalCost

  useEffect(() => {
    const newTotal = state.calculateTotal(state.tags)
    setState((prevState) => ({ ...prevState, totalCost: newTotal }))
  }, [state.tags])

  const handleResultSelect = (e, { result }) => {
    const item = cloneDeep(result)
    setState({ ...state, tags: [...tags, item] })
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
      const isMatch = (result) => re.test(result.name)
      setIsLoading(false)
      setResults(_.filter(state.serviceItems, isMatch))
    }, 300)
  }

  return (
    <Search
      loading={isLoading}
      onResultSelect={handleResultSelect}
      onSearchChange={_.debounce(handleSearchChange, 500, {
        leading: true,
      })}
      results={results}
      value={value}
    />
  )
}

ItemSearch.propTypes = {}

export default ItemSearch
