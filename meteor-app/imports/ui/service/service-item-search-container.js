import React, { useContext } from 'react'
import _ from 'lodash'
import SearchBar from './service-item-search'
import { ServiceContext } from './service-context'

export default function ServiceItemSearchContainer() {
  const [state, setState] = useContext(ServiceContext)

  const [isLoading, setIsLoading] = React.useState(false)
  const [results, setResults] = React.useState([])
  const [value, setValue] = React.useState('')

  const handleResultSelect = (e, { result }) => {
    let totalServicePrice = state.totalServicePrice
    if (result.price) {
      totalServicePrice = state.totalServicePrice + result.price
    } else {
      totalServicePrice = result.items.reduce((total, item) => {
        if (!item.greyed) {
          total += item.price
        }
        return total
      }, 0)
      totalServicePrice = totalServicePrice + state.totalServicePrice
    }
    const newTags = [...state.tags, result]
    const newState = { ...state, tags: newTags, totalServicePrice: totalServicePrice }
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
