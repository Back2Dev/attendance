import React from 'react'
import Lister from './lister'
// let Lister = () => <div>list component</div>

export default DBA = (props) => {
  const { collection, view, id } = props.match.params

  let Component = () => <div>Unknown component</div>

  switch (view) {
    case 'list':
      Component = Lister
  }

  return (
    <div>
      {collection} {view} {id}
      <Component collection={collection} view={view}></Component>
    </div>
  )
}
