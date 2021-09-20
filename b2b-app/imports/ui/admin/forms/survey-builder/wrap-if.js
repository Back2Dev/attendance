import React, { cloneElement } from 'react'
import { useBuilder } from './context'

const WrapIf = ({ condition, wrapTrue, wrapFalse, children }) => {
  if (condition) {
    return wrapTrue ? cloneElement(wrapTrue, null, children) : <div>{children}</div>
  }
  return wrapFalse ? cloneElement(wrapFalse, null, children) : <div>{children}</div>
}

const ResponsiveWrap = ({ mobile, desktop, children }) => {
  const { isMobile } = useBuilder()
  if (isMobile) {
    return mobile ? cloneElement(mobile, null, children) : <div>{children}</div>
  }

  return desktop ? cloneElement(desktop, null, children) : <div>{children}</div>
}

export { WrapIf as default, ResponsiveWrap }
