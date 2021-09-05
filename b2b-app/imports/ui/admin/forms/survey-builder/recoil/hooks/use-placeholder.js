import { useRecoilValue } from 'recoil'
import { placeholderAtom } from '../atoms'

export const usePlaceholderValue = (pid) => useRecoilValue(placeholderAtom(pid))
