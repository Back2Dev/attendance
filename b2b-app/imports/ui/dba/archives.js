import React from 'react'
import PropTypes from 'prop-types'
import { useParams } from 'react-router'

import { ArchivesProvider } from './archives/context'
import ArchivesList from './archives/list'

const DBAArchives = () => {
  const { collection } = useParams()
  // console.log('DBA', collection)

  const child = React.useMemo(() => {
    // console.log('render child')
    return (
      <ArchivesProvider collectionName={collection}>
        <ArchivesList />
      </ArchivesProvider>
    )
  }, [collection])

  return <div>{child}</div>
}

DBAArchives.propTypes = {
  collection: PropTypes.string,
  view: PropTypes.string,
}

export default React.memo(DBAArchives)
