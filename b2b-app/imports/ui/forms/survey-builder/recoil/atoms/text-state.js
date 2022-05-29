import { atomFamily } from 'recoil'
import produce from 'immer'
import { selectorFamily } from 'recoil'
import { dataCache } from '../../data-cache'
import { makeListItem } from '../../utils/list'
import { makeId } from '../../utils/makeId'

export const defaultTextAnswer = { placeholder: '', type: 'text' }

export const textAtom = atomFamily({
  key: 'textAtom',
  default: () => ({
    prompt: '',
    id: makeId(),
    type: 'text',
    answers: [makeListItem(defaultTextAnswer)],
  }),
  effects_UNSTABLE: (pid) => [
    ({ setSelf }) => {
      const text = dataCache.getQuestion(pid)
      if (!text) return
      setSelf(text)
    },
  ],
})

export const textQuestion = selectorFamily({
  key: 'textQuestion',
  get:
    (pid) =>
    ({ get }) => {
      return get(textAtom(pid)).prompt
    },
  set:
    (pid) =>
    ({ set, get }, newValue) => {
      const text = get(textAtom(pid))
      const nextState = produce(text, (draft) => {
        draft.prompt = newValue
      })
      set(textAtom(pid), nextState)
    },
})

export const textAnswer = selectorFamily({
  key: 'textAnswer',
  get:
    (pid) =>
    ({ get }) => {
      const text = get(textAtom(pid))
      return text.answers
    },
  set:
    (pid) =>
    ({ get, set }, newValue) => {
      const text = get(textAtom(pid))
      const nextState = produce(text, (draft) => {
        draft.answers = newValue
      })
      set(textAtom(pid), nextState)
    },
})

export const textSource = selectorFamily({
  key: 'textSource',
  get:
    (pid) =>
    ({ get }) => {
      const { prompt, id, answers } = get(textAtom(pid))
      const source = [
        `Q: ${prompt}`,
        `+id: ${id}`,
        '+type: text',
        `A: ${answers.title}`,
        `+val: ${answers.val}`,
      ]
        .flat(2)
        .filter(Boolean)
        .join('\n')

      return source
    },
})
