import { useEffect, useRef } from 'react'

/** this hook works like useEffect but skips on the initial render
 * https://stackoverflow.com/questions/53253940/make-react-useeffect-hook-not-run-on-initial-render
 */
const useDidMountEffect = (func, deps) => {
  const didMount = useRef(false)

  useEffect(() => {
    if (didMount.current) func()
    else didMount.current = true
  }, deps)
}

export default useDidMountEffect
