import { useSetRecoilState } from 'recoil'
import debug from 'debug'
import { dndAtom } from '../atoms'
import { useEffect } from 'react'

const log = debug('builder:use-dnd')

/** maps a react-beautiful-dnd droppable id to the list atom that will be re-ordered */
export const useDnd = (droppableId, listAtom) => {
  const setDnd = useSetRecoilState(dndAtom)

  useEffect(() => {
    setDnd((map) => {
      if (map.has(droppableId)) return map
      const nextMap = new Map(map)
      return nextMap.set(droppableId, listAtom)
    })
    return () => {
      setDnd((map) => {
        const nextMap = new Map(map)
        nextMap.delete(droppableId)
        // FIXME reset listAtom on unmount
        return nextMap
      })
    }
  }, [])
}
