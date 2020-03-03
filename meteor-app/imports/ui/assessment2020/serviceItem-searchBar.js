import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Search, Grid, Header, Segment, Label } from 'semantic-ui-react'
import faker from 'faker'
import _ from 'lodash'

const resultRenderer = ({ title }) => <Label content={title} />

resultRenderer.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string
}

const source = _.times(5, () => ({
  title: faker.company.companyName(),
  description: faker.company.catchPhrase(),
  image: faker.internet.avatar(),
  price: faker.finance.amount(0, 100, 2, '$')
}))

const SearchBar = () => {
  const [isLoading, setIsLoading] = React.useState(false)
  const [results, setResults] = React.useState([])
  const [value, setValue] = React.useState('')

  const handleResultSelect = (e, { result }) => setValue(result.title)

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
      setResults(_.filter(source, isMatch))
    }, 300)
  }

  return (
    <div>
      <Search
        loading={isLoading}
        onResultSelect={handleResultSelect}
        onSearchChange={handleSearchChange}
        results={results}
        value={value}
        resultRenderer={resultRenderer}
      />
      <Segment>
        <Header>State</Header>
        <pre style={{ overflowX: 'auto' }}>
          {JSON.stringify({ isLoading: isLoading, results: results, value: value }, null, 2)}
        </pre>
        <Header>Options</Header>
        <pre style={{ overflowX: 'auto' }}>{JSON.stringify(source, null, 2)}</pre>
      </Segment>
    </div>
  )
}

export default SearchBar
