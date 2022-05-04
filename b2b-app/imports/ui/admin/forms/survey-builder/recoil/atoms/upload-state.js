import { atomFamily } from 'recoil'
import produce from 'immer'
import { selectorFamily } from 'recoil'
import { dataCache } from '../../data-cache'
import { makeListItem } from '../../utils/list'

export const defaultAnswer = { name: '', url: '' }

export const uploadAtom = atomFamily({
  key: 'uploadAtom',
  default: () => ({
    prompt: '',
    id: '',
    type: 'upload',
    answers: [makeListItem(defaultAnswer)],
  }),
  effects_UNSTABLE: (pid) => [
    ({ setSelf }) => {
      const upload = dataCache.getQuestion(pid)
      if (!upload) return
      setSelf(upload)
    },
  ],
})

export const uploadQuestion = selectorFamily({
  key: 'uploadQuestion',
  get:
    (pid) =>
    ({ get }) => {
      return get(uploadAtom(pid)).prompt
    },
  set:
    (pid) =>
    ({ set, get }, newValue) => {
      const upload = get(uploadAtom(pid))
      const nextState = produce(upload, (draft) => {
        draft.prompt = newValue
      })
      set(uploadAtom(pid), nextState)
    },
})

export const uploadAnswers = selectorFamily({
  key: 'uploadAnswers',
  get:
    (pid) =>
    ({ get }) => {
      const upload = get(uploadAtom(pid))
      return upload.answers
    },
  set:
    (pid) =>
    ({ get, set }, newValue) => {
      const upload = get(uploadAtom(pid))
      const nextState = produce(upload, (draft) => {
        draft.answers = newValue
      })
      set(uploadAtom(pid), nextState)
    },
})

export const uploadAnswersAccept = selectorFamily({
  key: 'uploadAnswersAccept',
  get:
    (pid) =>
     ({ get }) => {
      const upload =  get(uploadAtom(pid))
      const accept = Object.entries(upload.val?.accept || {})
        .filter(([key, value]) => value)
        .map(([key, value]) => key)
      return {accept, multiple: upload.val?.multiple, maxSize: upload.val?.maxSize}
    },
})

export const uploadSource = selectorFamily({
  key: 'uploadSource',
  get:
    (pid) =>
    ({ get }) => {
      const { prompt, id, answers } = get(uploadAtom(pid))
      const source = [
        `Q: ${prompt}`,
        `+id: ${id}`,
        '+type: upload',
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
