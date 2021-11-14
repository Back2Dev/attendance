import React from 'react'
import LogMonitor from 'recoil-devtools-log-monitor'
import DockMonitor from 'recoil-devtools-dock'

export const RecoilDevtools = () => {
  if (process.env.NODE_ENV !== 'development') return null
  return (
    <DockMonitor
      toggleVisibilityKey="ctrl-h"
      changePositionKey="ctrl-q"
      changeMonitorKey="ctrl-m"
      defaultIsVisible={false}
    >
      <LogMonitor />
    </DockMonitor>
  )
}
