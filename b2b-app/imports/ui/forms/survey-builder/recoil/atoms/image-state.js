import { atomFamily } from 'recoil'
import produce from 'immer'
import { selectorFamily } from 'recoil'
import { dataCache } from '../../data-cache'
import { makeListItem } from '../../utils/list'
import { makeId } from '../../utils/makeId'

export const defaultImageAnswer = { prompt: '', name: '', val: '' }

export const imageAtom = atomFamily({
  key: 'imageAtom',
  default: () => ({
    prompt: '',
    // id: '',
    id: makeId(),
    type: 'image',
    answers: [makeListItem(defaultImageAnswer)],
  }),
  effects_UNSTABLE: (pid) => [
    ({ setSelf }) => {
      const image = dataCache.getQuestion(pid)
      if (!image) return
      setSelf(image)
    },
  ],
})

export const imageQuestion = selectorFamily({
  key: 'imageQuestion',
  get:
    (pid) =>
    ({ get }) => {
      return get(imageAtom(pid)).prompt
    },
  set:
    (pid) =>
    ({ set, get }, newValue) => {
      const image = get(imageAtom(pid))
      const nextState = produce(image, (draft) => {
        draft.prompt = newValue
      })
      set(imageAtom(pid), nextState)
    },
})

export const imageAnswers = selectorFamily({
  key: 'imageAnswers',
  get:
    (pid) =>
    ({ get }) => {
      const image = get(imageAtom(pid))
      return image.answers
    },
  set:
    (pid) =>
    ({ get, set }, newValue) => {
      const image = get(imageAtom(pid))

      const nextState = produce(image, (draft) => {
        draft.answers = newValue
      })
      set(imageAtom(pid), nextState)
    },
})

export const imageSource = selectorFamily({
  key: 'imageSource',
  get:
    (pid) =>
    ({ get }) => {
      const { prompt, id, answers } = get(imageAtom(pid))
      const source = [
        `Q: ${prompt}`,
        `+id: ${id}`,
        '+type: image',
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
