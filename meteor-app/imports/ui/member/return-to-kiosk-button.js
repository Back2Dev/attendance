import React from 'react'
import { Link } from 'react-router-dom'

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
