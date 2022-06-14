import { useRecoilState } from 'recoil'
import { list } from '../../utils'
import { defaultUndefinedAnswer, undefinedAnswers, undefinedQuestion } from '../atoms'

export const useUndefinedQuestion = (pid) => {
  const state = useRecoilState(undefinedQuestion(pid))
  return state
}

export const useUndefinedAnswers = (pid) => {
  const [answers, setAnswers] = useRecoilState(undefinedAnswers(pid))

  const add = (index) => {
    setAnswers(list.add(answers, defaultUndefinedAnswer, index))
  }

  const update = (value, index) => {
    setAnswers(list.update(answers, value, index))
  }

  const remove = (index) => {
    setAnswers(list.remove(answers, index))
  }

  return {
    all: answers,
    add,
    update,
    remove,
  }
}
