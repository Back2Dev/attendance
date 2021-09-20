import { useEffect } from 'react'
import { useRecoilCallback } from 'recoil'
import { useDidMountRecoilEffect } from '../../hooks'
import { dndAtom } from '../atoms'

/** maps a react-beautiful-dnd droppable id to the list atom that will be re-ordered */
export const useDnd = (droppableId, listAtom) => {
  const setDnd = useRecoilCallback(
    ({ set }) => (updater) => {
      set(dndAtom, (map) => updater(map))
    },
    []
  )

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
