import {
  useRecoilCallback,
  useRecoilState,
  useRecoilTransaction_UNSTABLE,
  useRecoilValue,
} from 'recoil'
import debug from 'debug'

import { TypeRegistry } from '../../components/types/type-registry'
import { list } from '../../utils'
import { partsAtom } from '../atoms'

const log = debug('builder:use-parts')

export const usePartsValue = () => {
  return useRecoilValue(partsAtom)
}

export const useParts = () => {
  const addPart = useRecoilCallback(({ set }) => (type) => {
    set(partsAtom, (parts) => list.add(parts, { config: TypeRegistry.get(type) }))
  })

  const removePart = useRecoilTransaction_UNSTABLE(({ set, reset, get }) => (pid) => {
    const part = list.findById(get(partsAtom), pid)
    if (!part) return
    const atomState = part.config.atom(pid)
    reset(atomState)
    set(partsAtom, (parts) => list.removeById(parts, pid))
  })

  const movePart = useRecoilCallback(({ set }) => (id, direction) => {
    set(partsAtom, (parts) => list.moveById(parts, id, direction))
  })

  return { addPart, removePart, movePart }
}

export const usePartsState = () => {
  return useRecoilState(partsAtom)
}
