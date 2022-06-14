import { atomFamily } from 'recoil'
import produce from 'immer'
import { selectorFamily } from 'recoil'
import { dataCache } from '../../data-cache'
import { makeListItem } from '../../utils/list'
import { makeId } from '../../utils/makeId'

export const defaultUndefinedAnswer = { name: '' }

export const undefinedAtom = atomFamily({
  key: 'undefinedAtom',
  default: () => ({
    prompt: '',
    // id: '',
    id: makeId(),
    type: 'single',
    answers: [makeListItem(defaultUndefinedAnswer)],
  }),
  effects_UNSTABLE: (pid) => [
    ({ setSelf }) => {
      const undefined = dataCache.getQuestion(pid)
      if (!undefined) return
      setSelf(undefined)
    },
  ],
})

export const undefinedQuestion = selectorFamily({
  key: 'undefinedQuestion',
  get:
    (pid) =>
    ({ get }) => {
      return get(undefinedAtom(pid)).prompt
    },
  set:
    (pid) =>
    ({ set, get }, newValue) => {
      const undefined = get(undefinedAtom(pid))
      const nextState = produce(undefined, (draft) => {
        draft.prompt = newValue
      })
      set(undefinedAtom(pid), nextState)
    },
})

export const undefinedAnswers = selectorFamily({
  key: 'undefinedAnswers',
  get:
    (pid) =>
    ({ get }) => {
      const undefined = get(undefinedAtom(pid))
      return undefined.answers
    },
  set:
    (pid) =>
    ({ get, set }, newValue) => {
      const undefined = get(undefinedAtom(pid))
      const nextState = produce(undefined, (draft) => {
        draft.answers = newValue
      })
      set(undefinedAtom(pid), nextState)
    },
})

export const undefinedSource = selectorFamily({
  key: 'undefinedSource',
  get:
    (pid) =>
    ({ get }) => {
      const { prompt, id, answers, optional } = get(undefinedAtom(pid))
      const source = [
        `Q: ${prompt}`,
        `+id: ${id}`,
        '+type: undefined',
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
