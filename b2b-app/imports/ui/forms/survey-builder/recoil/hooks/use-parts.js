import {
  useRecoilCallback,
  useRecoilState,
  useRecoilTransaction_UNSTABLE,
  useRecoilValue,
} from 'recoil'
import debug from 'debug'
import { makeId } from '/imports/ui/forms/survey-builder/utils/makeId'
import { TypeRegistry } from '../../components/types/type-registry'
import { list } from '../../utils'
import { partsAtom, partAtom } from '../atoms'

const log = debug('builder:use-parts')

export const usePartsValue = () => {
  return useRecoilValue(partsAtom)
}

export const usePartValue = (pid) => {
  useRecoilValue(getPartState(pid))
}

export const useParts = () => {
  const addPart = useRecoilCallback(({ set }) => (index) => {
    set(partsAtom, (parts) =>
      list.add(
        parts,
        { prompt: 'new Question', type: 'single', answers: [{ name: '' }] },
        index
      )
    )
  })

  const movePartToCanvas = useRecoilCallback(({ set }) => (type, index) => {
    set(partsAtom, (parts) => {
      const l = [...parts]
      l.splice(index, 0, {
        config: TypeRegistry.get(type),
        _id: makeId(),
      })
      return l
    })
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

  return { addPart, removePart, movePart, movePartToCanvas }
}

export const usePartsState = () => {
  return useRecoilState(partsAtom)
}
