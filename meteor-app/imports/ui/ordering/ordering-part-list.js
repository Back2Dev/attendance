import React from 'react'
import { Card, Header } from 'semantic-ui-react'

const PartList = (props) => {
  const { parts, Component, Loader, addToCart, activeOrder } = props

  return (
    <div>
      {React.Children.map(props.children, (child) => child)}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          height: '100%',
          alignContent: 'center',
          justifyContent: 'center'
        }}
      >
        {
          (!props.loading && parts) &&
          parts.map(part => (
            <div key={part._id}>
              <Component className="part-card" style={{ padding: '5px' }} {...part} addToCart={addToCart} activeOrder={activeOrder} />
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default PartList