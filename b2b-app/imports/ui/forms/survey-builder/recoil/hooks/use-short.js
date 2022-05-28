import { useRecoilState } from 'recoil'
import { shortAtom, shortAnswer, shortQuestion } from '../atoms/short-state'

export const useShortQuestion = (pid) => {
  const state = useRecoilState(shortQuestion(pid))
  return state
}

export const useAnswerShort = (pid) => {
  return useRecoilState(shortAnswer(pid))
}
