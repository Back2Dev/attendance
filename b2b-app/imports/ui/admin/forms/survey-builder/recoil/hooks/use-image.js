import { useRecoilState } from 'recoil'
import { list } from '../../utils'
import { defaultAnswer, imageAnswers, imageQuestion } from '../atoms'

export const useQuestion = (pid) => {
  const state = useRecoilState(imageQuestion(pid))
  return state
}

export const useAnswers = (pid) => {
  const [answers, setAnswers] = useRecoilState(imageAnswers(pid))

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
