import { useRecoilState } from 'recoil'
import { shortAtom } from '../atoms/short-state'

export const useShortQuestion = (pid) => {
  const state = useRecoilState(shortAtom(pid))
  return state
}

export const useShort = (pid) => {
  return useRecoilState(shortAtom(pid))
}
