import debug from 'debug'
import { useEffect } from 'react'
import { useBuilder } from '../context'
const log = debug('builder:use-dnd-sensor')

const useDndSensor = (api) => {
  const { setDndMove } = useBuilder()

  const move = ({ dir, draggableId }) => {
    if (!draggableId) return

    const preDrag = api.tryGetLock(draggableId)
    if (!preDrag) return

    const actions = preDrag.snapLift()
    if (dir === 'up') {
      actions.moveUp()
    } else if (dir === 'down') {
      actions.moveDown()
    }
    setTimeout(actions.drop, 0) // wait for move animation to finish
  }

  useEffect(() => {
    setDndMove(() => move)
  }, [])
}

export default useDndSensor
