import { useEffect } from 'react'
import { useRecoilCallback } from 'recoil'
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
      return map.set(droppableId, listAtom)
    })
    return () => {
      setDnd((map) => {
        map.delete(droppableId)
        return map
      })
    }
  }, [])
}
