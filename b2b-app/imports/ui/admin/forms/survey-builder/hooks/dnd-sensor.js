const useDndSensor = (api) => {
  function start(event) {
    event.preventDefault()
    const draggableId = api.findClosestDraggableId(event)
    if (!draggableId) return

    const preDrag = api.tryGetLock(draggableId)
    if (!preDrag) return

    const actions = preDrag.snapLift()

    actions.moveDown()
    setTimeout(actions.drop, 1000)
  }

  window.addEventListener('click', start)
}

export default useDndSensor
