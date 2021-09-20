import { atom } from 'recoil'

// in mobile, determines which drawer is open. 'parts' | 'inspector' | null
export const drawerAtom = atom({
  key: 'drawer',
  default: '',
})
