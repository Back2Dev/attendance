import React from 'react'
import Loading from '/imports/ui/components/commons/loading.js'

/** This does a trick with lazy load, that prevents the plugin being loaded
 * unless the id is present. This make for a faster page load
 */
const Chat = ({ settings }) => {
  const Drift = settings.drift
    ? React.lazy(() => import('react-driftjs'))
    : () => <span></span>
  return (
    <React.Suspense fallback={<Loading loading />}>
      <Drift appId={settings.drift} />
    </React.Suspense>
  )
}

export default Chat
