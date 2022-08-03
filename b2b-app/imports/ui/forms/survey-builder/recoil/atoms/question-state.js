import { atomFamily } from 'recoil'
import produce from 'immer'
import { selectorFamily } from 'recoil'
import { dataCache } from '../../data-cache'
import { makeListItem } from '../../utils/list'
import { makeId } from '../../utils/makeId'

export const defaultInnerAnswer = { name: '' }

export const questionAtom = atomFamily({
  key: 'commonquestionAtom',
  default: () => ({
    prompt: '',
    // id: '',
    id: makeId(),
    type: 'single',
    answers: [makeListItem(defaultInnerAnswer)],
  }),
  effects_UNSTABLE: (pid) => [
    ({ setSelf }) => {
      const question = dataCache.getQuestion(pid)
      if (!question) return
      setSelf(question)
    },
  ],
})

export const Question = selectorFamily({
  key: 'commonQuestion',
  get:
    (pid) =>
    ({ get }) => {
      return get(questionAtom(pid)).prompt
    },
  set:
    (pid) =>
    ({ set, get }, newValue) => {
      const question = get(questionAtom(pid))
      const nextState = produce(question, (draft) => {
        draft.prompt = newValue
      })
      set(questionAtom(pid), nextState)
    },
})

export const Answers = selectorFamily({
  key: 'commonAnswers',
  get:
    (pid) =>
    ({ get }) => {
      const question = get(questionAtom(pid))
      return question.answers
    },
  set:
    (pid) =>
    ({ get, set }, newValue) => {
      const question = get(questionAtom(pid))
      const nextState = produce(question, (draft) => {
        draft.answers = newValue
      })
      set(questionAtom(pid), nextState)
    },
})

export const questionSource = selectorFamily({
  key: 'commonSource',
  get:
    (pid) =>
    ({ get }) => {
      const { prompt, id, answers, optional, type } = get(questionAtom(pid))
      const source = [
        `Q: ${prompt}`,
        `+id: ${id}`,
        `+type: ${type}`,
        optional && `+optional`,
        answers.map(({ name, id, val }) => [
          `A: ${name}`,
          id && `+id: ${id}`,
          val && `+val: ${val}`,
        ]),
      ]
        .flat(2)
        .filter(Boolean)
        .join('\n')

      return source
    },
})
