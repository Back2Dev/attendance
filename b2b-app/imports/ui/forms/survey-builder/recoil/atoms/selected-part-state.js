import { selector, atom } from 'recoil'
import { list } from '../../utils'
import { partsAtom, partAtom } from './parts-state'

/** pid: string | null */
// TODO comments for atoms
export const selectedPartAtom = atom({
  key: 'selectedPart',
  default: null,
})

export const selectedPartData = selector({
  key: 'selectedPartData',
  get: ({ get }) => {
    const pid = get(selectedPartAtom)
    if (pid === null) return null

    // const part = list.findById(get(partsAtom), pid)
    const parts = get(partsAtom)
    const part = list.findById(parts, pid)
    if (!part) return null
    // const data = get(part.config.atom(pid))

    return part
  },
})
