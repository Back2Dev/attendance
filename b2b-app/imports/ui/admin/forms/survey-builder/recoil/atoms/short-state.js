import { atomFamily } from 'recoil'
import produce from 'immer'
import { selectorFamily } from 'recoil'
import { dataCache } from '../../data-cache'

export const defaultShortAnswer = { title: '', val: '', scrore: 1 }

export const shortAtom = atomFamily({
  key: 'shortAtom',
  default: () => ({
    prompt: '',
    id: '',
    type: 'text',
    answer: defaultShortAnswer,
  }),
  effects_UNSTABLE: (pid) => [
    ({ setSelf }) => {
      const short = dataCache.getQuestion(pid)
      console.log(short)

      if (!short) return
      setSelf(short)
    },
  ],
})

// export const shortAnswer = selectorFamily({
//   key: 'shortAnswer',
//   get: (pid) => ({ get }) => {
//     const short = get(shortAtom(pid))
//     return short.answer
//   },
//   set: (pid) => ({ get, set }, newValue) => {
//     const short = get(shortAnswer(pid))

//     const nextState = produce(short, (draft) => {
//       draft.answer = newValue
//     })
//     set(shortAtom(pid), nextState)
//   },
// })

export const shortSource = selectorFamily({
  key: 'shortSource',
  get: (pid) => ({ get }) => {
    const { prompt, id, answer } = get(shortAtom(pid))
    const source = [
      `Q: ${prompt}`,
      `+id: ${id}`,
      '+type: text',
      `A: ${answer.title}`,
      `+val: ${answer.val}`,
    ]
      .flat(2)
      .filter(Boolean)
      .join('\n')

    return source
  },
})
