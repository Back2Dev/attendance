import { useRecoilState } from 'recoil'
import { defaultTextAnswer, textAnswer, textQuestion } from '../atoms'
import { list } from '../../utils'

export const useTextQuestion = (pid) => {
  const state = useRecoilState(textQuestion(pid))
  return state
}

export const useTextAnswer = (pid) => {
  const [answers, setAnswers] = useRecoilState(textAnswer(pid))

  const add = (index) => {
    setAnswers(list.add(answers, defaultTextAnswer, index))
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
