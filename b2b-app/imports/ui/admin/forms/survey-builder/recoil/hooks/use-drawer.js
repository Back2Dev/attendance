import { useSetRecoilState, useRecoilValue, useRecoilState } from 'recoil'
import { drawerAtom } from '../atoms'

export const useSetDrawer = () => useSetRecoilState(drawerAtom)

export const useDrawer = () => useRecoilValue(drawerAtom)

export const useDrawerState = () => useRecoilState(drawerAtom)
