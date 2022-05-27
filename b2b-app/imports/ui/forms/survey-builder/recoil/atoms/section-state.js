import { atomFamily } from 'recoil'
import produce from 'immer'
import { selectorFamily } from 'recoil'
import { dataCache } from '../../data-cache'
import { makeListItem } from '../../utils/list'
import { makeId } from '../../utils/makeId'

export const defaultAnswer = { name: '', val: '' }

export const sectionAtom = atomFamily({
  key: 'sectionAtom',
  default: () => ({
    name: '',
    id: makeId(),
    type: 'section',
    questions: [makeListItem(defaultAnswer)],
  }),
  effects_UNSTABLE: (pid) => [
    ({ setSelf }) => {
      const section = dataCache.getSection(pid)
      if (!section) return
      setSelf(section)
    },
  ],
})

export const sectionName = selectorFamily({
  key: 'sectionName',
  get:
    (pid) =>
    ({ get }) => {
      return get(sectionAtom(pid))
    },
  set:
    (pid) =>
    ({ set, get }, newValue) => {
      const section = get(sectionAtom(pid))
      const nextState = produce(section, (draft) => {
        draft.name = newValue.name
      })
      set(sectionAtom(pid), nextState)
    },
})

// export const sectionAnswers = selectorFamily({
//   key: 'sectionAnswers',
//   get:
//     (pid) =>
//     ({ get }) => {
//       const section = get(sectionAtom(pid))
//       return section.answers
//     },
//   set:
//     (pid) =>
//     ({ get, set }, newValue) => {
//       const section = get(sectionAtom(pid))

//       const nextState = produce(section, (draft) => {
//         draft.answers = newValue
//       })
//       set(sectionAtom(pid), nextState)
//     },
// })

export const sectionSource = selectorFamily({
  key: 'sectionSource',
  get:
    (pid) =>
    ({ get }) => {
      const { name, id } = get(sectionAtom(pid))
      console.log('get section atom', get(sectionAtom(pid)))
      const source = [
        `S: ${name}`,
        `+id: ${id}`,
        // paragraphs && `+p: ${paragraphs}`,
        // headers && `+h3: ${headers}`,
      ]
        .flat(2)
        .filter(Boolean)
        .join('\n')

      return source
    },
})
