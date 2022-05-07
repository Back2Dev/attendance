import { atomFamily } from 'recoil'
import produce from 'immer'
import { selectorFamily } from 'recoil'
import { dataCache } from '../../data-cache'
import { makeListItem } from '../../utils/list'

export const defaultAnswer = { name: '', val: '' }

export const multiAtom = atomFamily({
  key: 'multiAtom',
  default: () => ({
    prompt: '',
    id: '',
    type: 'multi',
    answers: [makeListItem(defaultAnswer)],
  }),
  effects_UNSTABLE: (pid) => [
    ({ setSelf }) => {
      const multi = dataCache.getQuestion(pid)
      if (!multi) return
      setSelf(multi)
    },
  ],
})

export const multiQuestion = selectorFamily({
  key: 'multiQuestion',
  get: (pid) => ({ get }) => {
    return get(multiAtom(pid)).prompt
  },
  set: (pid) => ({ set, get }, newValue) => {
    const multi = get(multiAtom(pid))
    const nextState = produce(multi, (draft) => {
      draft.prompt = newValue
    })
    set(multiAtom(pid), nextState)
  },
})

export const multiAnswers = selectorFamily({
  key: 'multiAnswers',
  get: (pid) => ({ get }) => {
    const multi = get(multiAtom(pid))
    return multi.answers
  },
  set: (pid) => ({ get, set }, newValue) => {
    const multi = get(multiAtom(pid))

    const nextState = produce(multi, (draft) => {
      draft.answers = newValue
    })
    set(multiAtom(pid), nextState)
  },
})

export const multiSource = selectorFamily({
  key: 'multiSource',
  get: (pid) => ({ get }) => {
    const { prompt, id, answers } = get(multiAtom(pid))
    const source = [
      `Q: ${prompt}`,
      `+id: ${id}`,
      '+type: multi',
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
