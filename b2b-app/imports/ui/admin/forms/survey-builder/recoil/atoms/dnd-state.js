import { atom } from 'recoil'

/*
  {
    pid: listAtom,
    pid: listAtom2,
    ...
  }
*/
export const dndAtom = atom({
  key: 'dnd',
  default: new Map(),
})
