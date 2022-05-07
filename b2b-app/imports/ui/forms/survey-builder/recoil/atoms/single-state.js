import { atomFamily } from 'recoil'
import produce from 'immer'
import { selectorFamily } from 'recoil'
import { dataCache } from '../../data-cache'
import { makeListItem } from '../../utils/list'

export const defaultAnswer = { name: '', val: '' }

export const singleAtom = atomFamily({
  key: 'singleAtom',
  default: () => ({
    prompt: '',
    id: '',
    type: 'single',
    answers: [makeListItem(defaultAnswer)],
  }),
  effects_UNSTABLE: (pid) => [
    ({ setSelf }) => {
      const single = dataCache.getQuestion(pid)
      if (!single) return
      setSelf(single)
    },
  ],
})

export const singleQuestion = selectorFamily({
  key: 'singleQuestion',
  get: (pid) => ({ get }) => {
    return get(singleAtom(pid)).prompt
  },
  set: (pid) => ({ set, get }, newValue) => {
    const single = get(singleAtom(pid))
    const nextState = produce(single, (draft) => {
      draft.prompt = newValue
    })
    set(singleAtom(pid), nextState)
  },
})

export const singleAnswers = selectorFamily({
  key: 'singleAnswers',
  get: (pid) => ({ get }) => {
    const single = get(singleAtom(pid))
    return single.answers
  },
  set: (pid) => ({ get, set }, newValue) => {
    const single = get(singleAtom(pid))

    const nextState = produce(single, (draft) => {
      draft.answers = newValue
    })
    set(singleAtom(pid), nextState)
  },
})

export const singleSource = selectorFamily({
  key: 'singleSource',
  get: (pid) => ({ get }) => {
    const { prompt, id, answers } = get(singleAtom(pid))
    const source = [
      `Q: ${prompt}`,
      `+id: ${id}`,
      '+type: single',
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
