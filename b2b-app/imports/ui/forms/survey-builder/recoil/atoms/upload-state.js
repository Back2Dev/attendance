import { atomFamily } from 'recoil'
import produce from 'immer'
import { selectorFamily } from 'recoil'
import { dataCache } from '../../data-cache'
import { makeId } from '../../utils/makeId'
import { makeListItem } from '../../utils/list'

export const defaultUploadAnswer = { name: '',val:'', url: '', accept:{ '.pdf': true, 'image/*': true, '.txt': true, 'video/*': false },maxSize:100, maxFiles:1, multiple:false}


export const uploadAtom = atomFamily({
  key: 'uploadAtom',
  default: () => ({
    prompt: '',
    // id: '',
    id: makeId(),
    type: 'upload',
    answers: [makeListItem(defaultUploadAnswer)],
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
      const upload = get(uploadAtom(pid))
      const accept = Object.entries(upload.val?.accept || {})
        .filter(([_, value]) => value)
        .map(([key]) => key)
      return { accept, maxFiles: upload.val?.maxFiles, maxSize: upload.val?.maxSize }
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
