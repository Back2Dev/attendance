import { atom } from 'recoil'
import { dataCache } from '../../data-cache'

export const partsAtom = atom({
  key: 'parts',
  default: [],
  effects_UNSTABLE: [
    ({ setSelf }) => {
      const parts = dataCache.getParts()
      if (!parts) return
      setSelf(parts)
    },
  ],
})
