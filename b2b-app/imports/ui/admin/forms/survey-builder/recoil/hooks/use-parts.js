import { useRecoilCallback, useRecoilState, useRecoilValue } from 'recoil'
import { list } from '../../utils'
import { partsAtom } from '../atoms'

export const usePartsValue = () => {
  return useRecoilValue(partsAtom)
}

export const useParts = () => {
  const addPart = useRecoilCallback(({ set }) => (type) => {
    set(partsAtom, (parts) => list.add(parts, { type }))
  })

  const removePart = useRecoilCallback(({ set, snapshot }) => (id) => {
    // TODO delete the atom after removing it from the parts array
    // const { type } = snapshot.getLoadable(partsAtom(id)).contents
    set(partsAtom, (parts) => list.removeById(parts, id))
    // delete the atom
    // reset(typesMap(type).atom(id))
  })

  const movePart = useRecoilCallback(({ set }) => (id, direction) => {
    set(partsAtom, (parts) => list.moveById(parts, id, direction))
  })

  return { addPart, removePart, movePart }
}

export const usePartsState = () => {
  return useRecoilState(partsAtom)
}
