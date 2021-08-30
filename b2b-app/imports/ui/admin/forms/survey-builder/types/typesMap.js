import { Single, singleSourceState } from './single'

export function typesMap(type) {
  return {
    single: { component: Single, sourceState: singleSourceState },
  }[type]
}
