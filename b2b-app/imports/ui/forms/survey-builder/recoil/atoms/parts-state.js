import { atom, selectorFamily, atomFamily } from 'recoil'
import produce from 'immer'
import { dataCache } from '../../data-cache'
// import { findById } from '/imports/ui/forms/survey-builder/utils/list'
import { get as lget, set as lset } from 'lodash'
import { makeListItem } from '$sb/utils/list'
import { makeId } from '$sb/utils/makeId'

/** Stores the list of question type instances that will render in the canvas
 *
 * state shape: [{ _id: string, config: TypeRegistry }]
 *
 * '_id' key:
 * globally unique id for a question type instance. We prefix id with '_' because the id will be
 * different depending on the scenario. If loading a question type instance from data, the id will
 * come from the JSON schema. However if we're creating a brand new instance in the dnd editor, it
 * will automatically generate a unique id.
 *
 * 'config' key:
 * question type config object returned from TypeRegistry.get(type: string)
 */

export const partsAtom = atom({
  key: 'parts',
  default: [],
  effects_UNSTABLE: [
    ({ setSelf }) => {
      const parts = dataCache.getParts()
      if (!parts) return
      setSelf(parts)
    },
  ],
})

const defaultPart = { name: '' }

export const partAtom = atomFamily({
  key: 'partAtom',
  default: () => ({
    prompt: '',
    id: makeId(),
    type: 'single',
    answers: [makeListItem(defaultPart)],
  }),
  effects_UNSTABLE: (pid) => [
    ({ setSelf }) => {
      const part = dataCache.getPart(pid)
      if (!part) return
      setSelf(part)
    },
  ],
})

export const partAnswers = selectorFamily({
  key: 'partAnswers',
  get:
    (pid) =>
    ({ get }) => {
      const part = get(partAtom(pid))
      return part.answers
    },
  set:
    (pid) =>
    ({ get, set }, newValue) => {
      const part = get(partAtom(pid))
      const nextState = produce(part, (draft) => {
        draft.answers = newValue
      })

      set(partAtom(pid), nextState)
      // set(
      //   partsAtom,
      //   parts.map((part) => (part._id === pid ? nextState : part))
      // )
    },
})

export const partGridColumns = selectorFamily({
  key: 'partGridColumns',
  get:
    (pid) =>
    ({ get }) => {
      const part = get(partAtom(pid))
      return part.answers[0].columns
    },
  set:
    (pid) =>
    ({ get, set }, newValue) => {
      const part = get(partAtom(pid))
      const nextState = produce(part, (draft) => {
        draft.answers[0].columns = newValue
      })
      set(partAtom(pid), nextState)
    },
})

export const partGridRows = selectorFamily({
  key: 'partGridRows',
  get:
    (pid) =>
    ({ get }) => {
      const part = get(partAtom(pid))
      return part.answers[0].rows
    },
  set:
    (pid) =>
    ({ get, set }, newValue) => {
      const part = get(partAtom(pid))
      const nextState = produce(part, (draft) => {
        draft.answers[0].rows = newValue
      })
      set(partAtom(pid), nextState)
    },
})

export const editPartState = selectorFamily({
  key: 'editPart',
  get:
    ({ pid, path }) =>
    ({ get }) => {
      // const parts = get(partsAtom)
      const part = get(partAtom(pid))
      // const part = findById(parts, pid)
      return lget(part, path)
    },
  set:
    ({ pid, path }) =>
    ({ get, set }, newValue) => {
      // const parts = get(partsAtom)
      // const part = findById(parts, pid)
      const part = get(partAtom(pid))
      const nextState = produce(part, (draft) => {
        lset(draft, path, newValue)
      })
      set(partAtom(pid), nextState)
    },
})

//force rerender canvas when new question type is "section" because we need to re-categorise each questions to a specific section
export const editPartsState = selectorFamily({
  key: 'editParts',
  get:
    ({ pid }) =>
    ({ get }) => {
      const part = get(partAtom(pid))
      return part
    },
  set:
    ({ pid }) =>
    ({ get, set }, newValue) => {
      const parts = get(partsAtom)
      set(
        partsAtom,
        parts.map((part) => {
          if (part._id === pid) {
            return newValue
          }
          return part
        })
      )
    },
})

export const headerOnly = selectorFamily({
  key: 'headerOnly',
  get:
    ({ pid }) =>
    ({ get }) => {
      const part = get(partAtom(pid))
      // const parts = get(partsAtom)
      // const part = findById(parts, pid)
      return part
    },
  set:
    ({ pid }) =>
    ({ get, set }, newValue) => {
      const part = get(partAtom(pid))
      // const parts = get(partsAtom)
      // const part = findById(parts, pid)
      const nextState = produce(part, () => {
        return newValue
      })

      set(partAtom(pid), nextState)
    },
})

export const partSource = selectorFamily({
  key: 'partSource',
  get:
    (pid) =>
    ({ get }) => {
      const { prompt, name, type, id, answers, optional } = get(partAtom(pid))
      const source = [
        `Q: ${prompt ?? name}`,
        `+id: ${_id ?? id}`,
        `+type: ${type}`,
        optional && `+optional`,
        answers.map(({ name, id, val, type }) => [
          `A: ${name}`,
          id && `+id: ${_id ?? id}`,
          val && `+val: ${val}`,
          `+type: ${type}`,
        ]),
      ]
        .flat(2)
        .filter(Boolean)
        .join('\n')

      return source
    },
})
