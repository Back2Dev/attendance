import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloProvider } from 'react-apollo'
import { BrowserRouter } from 'react-router-dom'
import 'semantic-ui-css/semantic.min.css'

// import Routes from './router'
import App from './ui/components/App'
import { getSetting } from './utils/settings'

const db_uri = getSetting('REACT_APP_API_URL')
console.log("Connecting to "+db_uri)
const client = new ApolloClient({
  link: createHttpLink({ 
    uri: db_uri,
    opts: {
      credentials: 'same-origin',
    }
  }),
  cache: new InMemoryCache(),
})
// TODO: What happens if the connect fails, either initially, or at some time later?

const Root = () => {
  return (
    <BrowserRouter>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </BrowserRouter>
  )
}

ReactDOM.render(<Root />, document.querySelector('#root'));
