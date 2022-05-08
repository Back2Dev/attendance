import { useRecoilState } from 'recoil'
import { list } from '../../utils'
import { defaultAnswer, multipleAnswers, multipleQuestion } from '../atoms'

export const useMultipleQuestion = (pid) => {
  const state = useRecoilState(multipleQuestion(pid))
  return state
}

export const useMultipleAnswers = (pid) => {
  const [answers, setAnswers] = useRecoilState(multipleAnswers(pid))

  const add = (index) => {
    setAnswers(list.add(answers, defaultAnswer, index))
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
