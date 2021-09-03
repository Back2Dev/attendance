import { singleSource } from '../recoil/atoms'
import { Single, mapDataToAtom } from './single'

export function typesMap(type) {
  return {
    single: { component: Single, sourceState: singleSource, mapDataToAtom },
  }[type]
}
