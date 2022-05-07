import { atom } from 'recoil'
import { dataCache } from '../../data-cache'

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
