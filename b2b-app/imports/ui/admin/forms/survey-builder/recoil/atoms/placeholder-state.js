import { atomFamily, selectorFamily } from 'recoil'
import { dataCache } from '../../data-cache'

export const placeholderAtom = atomFamily({
  key: 'placeholder',
  default: {},
  effects_UNSTABLE: (pid) => [
    ({ setSelf }) => {
      const data = dataCache.getQuestion(pid)
      if (!data) return
      setSelf(dataCache.getQuestion(pid))
    },
  ],
})

export const placeholderSource = selectorFamily({
  key: 'placeholderSource',
  get: (pid) => ({ get }) => {
    /** this would be where we transform the atom to source but since we don't handle this type yet
     * just return something */
    const state = get(placeholderAtom(pid))
    return `Generated source for ${state.type}. Uhhh Q: something... A: something...`
  },
})
