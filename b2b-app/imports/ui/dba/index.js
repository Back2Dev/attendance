import React from 'react'
import { useParams } from 'react-router'

import Lister from './lister'
// let Lister = () => <div>list component</div>

const DBA = () => {
  const { collection, view, id } = useParams()
  console.log({ collection, view, id })

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

export default DBA
