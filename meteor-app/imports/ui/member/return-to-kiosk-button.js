import React from 'react'
import { Link } from 'react-router-dom'

console.log('test')

class Kioskbutton extends React.Component {
  render() {
    return (
      <div>
        <button>
          <Link to="/">home</Link>
        </button>
      </div>
    )
  }
}

export { Kioskbutton as default }
