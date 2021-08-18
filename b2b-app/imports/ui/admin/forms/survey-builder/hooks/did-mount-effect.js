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

/** temp fix for double initial render issue in recoil
 * https://github.com/facebookexperimental/Recoil/issues/307
 */
const useDidMountRecoilEffect = (func, deps) => {
  const didMount = useRef(0)

  useEffect(() => {
    if (didMount.current > 1) func()
    else didMount.current++
  }, deps)
}

export { useDidMountEffect as default, useDidMountRecoilEffect }
