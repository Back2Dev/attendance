import React, { useContext } from 'react'
import _ from 'lodash'
import { Search, Label } from 'semantic-ui-react'
import { ServiceContext } from './service-context'

const ItemSearch = () => {
  const [state, setState] = useContext(ServiceContext)

  const [isLoading, setIsLoading] = React.useState(false)
  const [results, setResults] = React.useState([])
  const [value, setValue] = React.useState('')

  const handleResultSelect = (e, { result }) => {
    let totalPrice = state.totalPrice
    if (result.price) {
      totalPrice = state.totalPrice + result.price
    } else {
      totalPrice = result.items.reduce((total, item) => {
        if (!item.greyed) {
          total += item.price
        }
        return total
      }, 0)
      totalPrice = totalPrice + state.totalPrice
    }
    const newTags = [...state.tags, result]
    const newState = { ...state, tags: newTags, totalPrice: totalPrice }
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
