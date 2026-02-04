import React from 'react'
import { SnackbarProvider, useSnackbar } from 'notistack'

let enqueue = null

const AlertBridge = () => {
  const { enqueueSnackbar } = useSnackbar()
  React.useEffect(() => {
    enqueue = enqueueSnackbar
    return () => {
      if (enqueue === enqueueSnackbar) enqueue = null
    }
  }, [enqueueSnackbar])
  return null
}

export const AlertProvider = ({ children }) => (
  <SnackbarProvider
    maxSnack={3}
    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
  >
    <AlertBridge />
    {children}
  </SnackbarProvider>
)

const notify = (variant, msg) => {
  if (enqueue) enqueue(msg, { variant })
  else console.warn('Alert not ready:', msg)
}

const Alert = {
  info: (msg) => notify('info', msg),
  success: (msg) => notify('success', msg),
  error: (msg) => notify('error', msg),
  warning: (msg) => notify('warning', msg),
}

export default Alert
