import { useEffect } from 'react'
import { useRecoilCallback } from 'recoil'

/* initializes recoil state and allows debug logging with RecoilDevtools. We need to use an
effect hook because RecoilDevtools doesn't show initial state */
const useInitRecoil = (setter) =>
  useEffect(
    useRecoilCallback((callbacks) => () => {
      setter(callbacks)
    }),
    []
  )

export default useInitRecoil
