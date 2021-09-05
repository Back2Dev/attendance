import React from 'react'
import PropTypes from 'prop-types'
import { useParams } from 'react-router'

import { CollectionProvider } from './context'
import Grid from './grid'

const DBA = () => {
  const { collection, view } = useParams()
  // console.log('DBA', collection, view)

  const child = React.useMemo(() => {
    // console.log('render child')
    return (
      <CollectionProvider collectionName={collection} viewName={view}>
        <Grid />
      </CollectionProvider>
    )
  }, [collection, view])

  return <div>{child}</div>
}

DBA.propTypes = {
  collection: PropTypes.string,
  view: PropTypes.string,
}

export default React.memo(DBA)
