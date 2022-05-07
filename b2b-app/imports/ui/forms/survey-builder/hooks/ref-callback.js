import React from 'react'

/** https://github.com/lovasoa/react-contenteditable/issues/161#issuecomment-736053428
 * fixes bug in react-contenteditable module related to using hooks
 */
const useRefCallback = (value, deps) => {
  const ref = React.useRef(value)

  React.useEffect(() => {
    ref.current = value
  }, deps ?? [value])

  const result = React.useCallback((...args) => {
    ref.current?.(...args)
  }, [])

  return result
}

export { useRefCallback }
