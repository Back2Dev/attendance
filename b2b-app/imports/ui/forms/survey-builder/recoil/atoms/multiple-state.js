import { atomFamily } from 'recoil'
import produce from 'immer'
import { selectorFamily } from 'recoil'
import { dataCache } from '../../data-cache'
import { makeListItem } from '../../utils/list'
import { makeId } from '../../utils/makeId'

export const defaultAnswer = { name: '', val: '' }

export const multipleAtom = atomFamily({
  key: 'multipleAtom',
  default: () => ({
    prompt: '',
    // id: '',
    id: makeId(),
    type: 'multiple',
    answers: [makeListItem(defaultAnswer)],
  }),
  effects_UNSTABLE: (pid) => [
    ({ setSelf }) => {
      const multiple = dataCache.getQuestion(pid)
      if (!multiple) return
      setSelf(multiple)
    },
  ],
})

export const multipleQuestion = selectorFamily({
  key: 'multipleQuestion',
  get:
    (pid) =>
    ({ get }) => {
      return get(multipleAtom(pid)).prompt
    },
  set:
    (pid) =>
    ({ set, get }, newValue) => {
      const multiple = get(multipleAtom(pid))
      const nextState = produce(multiple, (draft) => {
        draft.prompt = newValue
      })
      set(multipleAtom(pid), nextState)
    },
})

export const multipleAnswers = selectorFamily({
  key: 'multipleAnswers',
  get:
    (pid) =>
    ({ get }) => {
      const multiple = get(multipleAtom(pid))
      return multiple.answers
    },
  set:
    (pid) =>
    ({ get, set }, newValue) => {
      const multiple = get(multipleAtom(pid))

      const nextState = produce(multiple, (draft) => {
        draft.answers = newValue
      })
      set(multipleAtom(pid), nextState)
    },
})

export const multipleSource = selectorFamily({
  key: 'multipleSource',
  get:
    (pid) =>
    ({ get }) => {
      const { prompt, id, answers } = get(multipleAtom(pid))
      const source = [
        `Q: ${prompt}`,
        `+id: ${id}`,
        '+type: multiple',
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
