import { selector, atom } from 'recoil'
import { singleAtom } from './single-state'

/** {
 *    _id: string, - unique id for a part
 *    type: string - question type eg. 'single', 'short'
 * } | null
 * */
// TODO comments for atoms
export const selectedPartAtom = atom({
  key: 'selectedPart',
  default: null,
})

export const selectedPartData = selector({
  key: 'selectedPartData',
  get: ({ get }) => {
    const selectedPart = get(selectedPartAtom)
    if (selectedPart === null) return null
    // TODO update to use typesMap
    const single = get(singleAtom(selectedPart))
    return single
  },
})
