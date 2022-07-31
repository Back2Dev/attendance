import { useRecoilState } from 'recoil'
import { list } from '../../utils'
import { defaultAnswer, Answers, Question } from '../atoms'

export const useQuestion = (pid) => {
  const state = useRecoilState(Question(pid))
  return state
}

export const useAnswers = (pid) => {
  const [answers, setAnswers] = useRecoilState(Answers(pid))

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
