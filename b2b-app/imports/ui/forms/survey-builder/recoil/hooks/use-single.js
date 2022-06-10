import { useRecoilState } from 'recoil'
import { list } from '../../utils'
import { defaultAnswer, singleAnswers, singleQuestion } from '../atoms'

export const useQuestion = (pid) => {
  const state = useRecoilState(singleQuestion(pid))
  return state
}

export const useAnswers = (pid) => {
  const [answers, setAnswers] = useRecoilState(singleAnswers(pid))

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
