import { useRecoilState } from 'recoil'
// import { list } from '../../utils'
import { sectionName } from '../atoms'

export const useSection = (pid) => {
  const state = useRecoilState(sectionName(pid))
  return state
}
