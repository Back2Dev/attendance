import { atom, selectorFamily, atomFamily } from 'recoil'
import produce from 'immer'
import { dataCache } from '../../data-cache'
import { findById } from '/imports/ui/forms/survey-builder/utils/list'
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

export const editPartState = selectorFamily({
  key: 'editPart',
  get:
    ({ pid, path }) =>
    ({ get }) => {
      const parts = get(partsAtom)
      const part = findById(parts, pid)
      return lget(part, path)
    },
  set:
    ({ pid, path }) =>
    ({ get, set }, newValue) => {
      const parts = get(partsAtom)
      const part = findById(parts, pid)
      const nextState = produce(part, (draft) => {
        lset(draft, path, newValue)
      })
      set(partAtom(pid), nextState)
      set(
        partsAtom,
        parts.map((part) => (part._id === pid ? nextState : part))
      )
    },
})

export const getPartState = selectorFamily({
  key: 'getPartState',
  get:
    ({ pid }) =>
    ({ get }) => {
      const parts = get(partsAtom)
      const part = findById(parts, pid)
      return part
    },
  set:
    ({ pid, path }) =>
    ({ get, set }, newValue) => {
      const parts = get(partsAtom)
      const part = findById(parts, pid)
      const nextState = produce(part, (draft) => {
        lset(draft, path, newValue)
      })
      set(partAtom(pid), nextState)
    },
})
