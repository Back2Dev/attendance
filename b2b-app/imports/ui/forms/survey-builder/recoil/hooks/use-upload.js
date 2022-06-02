import { useRecoilState } from 'recoil'
import { list } from '../../utils'
import { defaultUploadAnswer, uploadAnswers, uploadQuestion } from '../atoms'

export const useUploadQuestion = (pid) => {
  const state = useRecoilState(uploadQuestion(pid))
  return state
}

export const useUploadAnswers = (pid) => {
  const [answers, setAnswers] = useRecoilState(uploadAnswers(pid))

  const add = (index) => {
    setAnswers(list.add(answers, defaultUploadAnswer, index))
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
